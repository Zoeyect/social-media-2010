"""Deterministic geometry audit, in mm; AABB/BVH candidates are not proof.

Run via Blender --background --python audit_iphone4.py -- --input model.glb
--output report.json. Also imported by build_iphone4.py before/after export.
Flat alpha decals/text intentionally have open boundaries; solid parts may not.
"""
import argparse
import itertools
import json
import math
import sys
from pathlib import Path

import bpy
import bmesh
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from mathutils.geometry import intersect_ray_tri


def surface(obj):
    mesh = obj.data
    mesh.calc_loop_triangles()
    verts = [obj.matrix_world @ v.co * 1000 for v in mesh.vertices]
    triangles = [tuple(t.vertices) for t in mesh.loop_triangles]
    return verts, triangles, BVHTree.FromPolygons(verts, triangles, all_triangles=True, epsilon=0)


def crosses(a, b):
    """Strict interior edge/triangle crossing, excluding contact at edges/ends."""
    for source, target in ((a, b), (b, a)):
        for i in range(3):
            start, end = source[i], source[(i+1) % 3]
            delta = end-start
            if delta.length < 1e-8:
                continue
            hit = intersect_ray_tri(*target, delta, start, True)
            if hit is None:
                continue
            t = (hit-start).dot(delta) / delta.length_squared
            if not 1e-6 < t < 1-1e-6:
                continue
            # A hit on the perimeter of the target is mere edge contact.
            distances = [(target[(j+1) % 3]-target[j]).cross(hit-target[j]).length /
                         max((target[(j+1) % 3]-target[j]).length, 1e-12) for j in range(3)]
            if min(distances) > 1e-5:
                return True
    return False


def coplanar_overlap(a, b):
    """Positive-area triangle overlap, not shared edges (mm tolerances)."""
    normal = (a[1]-a[0]).cross(a[2]-a[0])
    if normal.length < 1e-10:
        return False
    normal.normalize()
    if any(abs((v-a[0]).dot(normal)) > 1e-5 for v in b):
        return False
    drop = max(range(3), key=lambda i: abs(normal[i]))
    axes = [i for i in range(3) if i != drop]
    polygon = [Vector((v[axes[0]], v[axes[1]])) for v in a]
    clip = [Vector((v[axes[0]], v[axes[1]])) for v in b]
    def cross2(u, v): return u.x*v.y-u.y*v.x
    sign = 1 if cross2(clip[1]-clip[0], clip[2]-clip[0]) > 0 else -1
    for i in range(3):
        start, end = clip[i], clip[(i+1) % 3]
        old, polygon = polygon, []
        if not old: return False
        for j, p in enumerate(old):
            q = old[(j+1) % len(old)]
            dp = sign*cross2(end-start, p-start)
            dq = sign*cross2(end-start, q-start)
            if dp >= 0: polygon.append(p)
            if (dp >= 0) != (dq >= 0):
                polygon.append(p+(q-p)*(dp/(dp-dq)))
    area = abs(sum(cross2(p, polygon[(i+1) % len(polygon)]) for i, p in enumerate(polygon)))/2
    return area > 1e-7


def box_surface(low, high):
    vertices = [Vector((x, y, z)) for x in (low[0], high[0])
                for y in (low[1], high[1]) for z in (low[2], high[2])]
    quads = [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1),
             (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)]
    tris = [(q[0], q[1], q[2]) for q in quads]+[(q[0], q[2], q[3]) for q in quads]
    return vertices, tris, BVHTree.FromPolygons(vertices, tris, all_triangles=True)


def audit_scene():
    bpy.context.view_layer.update()
    objects = sorted((o for o in bpy.context.scene.objects if o.type == "MESH"), key=lambda o: o.name)
    result = {"units": "mm", "objects": {}, "aabb_warnings": [], "surface_crossings": [],
              "motion_crossings": [], "topology_failures": [], "self_crossings": [],
              "coplanar_overlaps": [], "runtime_envelope_crossings": []}
    surfaces = {}
    for obj in objects:
        vertices, triangles, tree = surface(obj)
        surfaces[obj.name] = (vertices, triangles, tree)
        self_hit = planar_hit = False
        for i, j in tree.overlap(tree):
            if i >= j or set(triangles[i]) & set(triangles[j]):
                continue
            a, b = [vertices[v] for v in triangles[i]], [vertices[v] for v in triangles[j]]
            # glTF duplicates the same geometric vertex at normal/UV seams.
            # Treat adjacent triangles consistently before and after roundtrip.
            if any((p-q).length < 1e-5 for p in a for q in b):
                continue
            if not self_hit and crosses(a, b):
                result["self_crossings"].append({"object": obj.name, "triangles": [i, j]})
                self_hit = True
            if not planar_hit and coplanar_overlap(a, b):
                result["coplanar_overlaps"].append({"objects": [obj.name], "triangles": [i, j]})
                planar_hit = True
        low = [min(v[i] for v in vertices) for i in range(3)]
        high = [max(v[i] for v in vertices) for i in range(3)]
        # Weld a COPY, because glTF splits vertices at UV/material/normal seams.
        bm = bmesh.new(); bm.from_mesh(obj.data)
        bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=1e-9)
        bm.normal_update()
        allowed_materials = {i for i, m in enumerate(obj.data.materials)
                             if m and m.name.split(".")[0] in ("MAT_RearLogo", "MAT_RearEtching")}
        boundary = [e for e in bm.edges if not e.is_manifold]
        unexpected = [e for e in boundary if not e.link_faces or any(f.material_index not in allowed_materials for f in e.link_faces)]
        zero_faces = sum(f.calc_area() < 1e-18 for f in bm.faces)
        invalid_normals = sum(not all(math.isfinite(n) for n in f.normal) or f.normal.length < 0.99 for f in bm.faces)
        loose = sum(not v.link_faces for v in bm.verts)
        degenerate = sum((vertices[t[1]]-vertices[t[0]]).cross(vertices[t[2]]-vertices[t[0]]).length < 1e-10 for t in triangles)
        info = {"min": low, "max": high, "size": [high[i]-low[i] for i in range(3)],
                "origin_blender": list(obj.matrix_world.translation * 1000),
                "scale": list(obj.scale), "triangles": len(triangles),
                "non_manifold_solid_edges": len(unexpected), "intentional_decal_boundary_edges": len(boundary)-len(unexpected),
                "zero_area_faces": zero_faces, "degenerate_triangles": degenerate,
                "invalid_normals": invalid_normals, "loose_vertices": loose}
        if unexpected or zero_faces or invalid_normals or loose or degenerate:
            result["topology_failures"].append(obj.name)
        result["objects"][obj.name] = info
        bm.free()
    for first, second in itertools.combinations(objects, 2):
        a, b = result["objects"][first.name], result["objects"][second.name]
        if not all(min(a["max"][i], b["max"][i])-max(a["min"][i], b["min"][i]) > 1e-5 for i in range(3)):
            continue
        av, at, ab = surfaces[first.name]; bv, bt, bb = surfaces[second.name]
        candidates = ab.overlap(bb)
        result["aabb_warnings"].append({"pair": [first.name, second.name], "bvh_candidates": len(candidates)})
        if any(crosses([av[v] for v in at[i]], [bv[v] for v in bt[j]]) for i, j in candidates):
            result["surface_crossings"].append([first.name, second.name])
        if any(coplanar_overlap([av[v] for v in at[i]], [bv[v] for v in bt[j]]) for i, j in candidates):
            result["coplanar_overlaps"].append({"objects": [first.name, second.name]})
    # Source controls translated to exact runtime maximum depression (0.16 mm).
    for name, delta in [("PowerButton", (0, 0, -0.16)), ("HomeButton", (0, 0.16, 0)),
                        ("VolumeUp", (0.16, 0, 0)), ("VolumeDown", (0.16, 0, 0))]:
        if name not in surfaces: continue
        verts, tris, _ = surfaces[name]
        moved = [v+Vector(delta) for v in verts]
        tree = BVHTree.FromPolygons(moved, tris, all_triangles=True)
        for shell in ("StainlessFrame", "PhoneBody", "FrontGlass", "BackGlass"):
            sv, st, sb = surfaces[shell]
            if any(crosses([moved[v] for v in tris[i]], [sv[v] for v in st[j]]) for i, j in tree.overlap(sb)):
                result["motion_crossings"].append([name, shell])
    # Conservative envelopes derived from the EXISTING runtime, in Blender mm.
    # Mute children replace source visuals; audit both end states against shell.
    mx, my, mz = result["objects"]["MuteSwitch"]["origin_blender"]
    envelopes = {"HeroCableMetal": ((-10.4, -0.6, -59.95), (10.4, 0.6, -53.95)),
                 "MuteRecess": ((mx+0.07, -1.7, mz-3), (mx+0.10, 1.7, mz+3))}
    for state, depth in (("Ringer", -0.75), ("Silent", 0.75)):
        envelopes["Mute"+state] = ((mx-0.16, depth-0.5, mz-2.4), (mx, depth+0.5, mz+2.4))
    for name, (low, high) in envelopes.items():
        pv, pt, pb = box_surface(low, high)
        for shell in ("StainlessFrame", "PhoneBody", "FrontGlass", "BackGlass", "Dock30Pin"):
            sv, st, sb = surfaces[shell]
            if any(crosses([pv[v] for v in pt[i]], [sv[v] for v in st[j]]) for i, j in pb.overlap(sb)):
                result["runtime_envelope_crossings"].append([name, shell])
    result["runtime_envelopes_blender_mm"] = envelopes
    low = [min(o["min"][i] for o in result["objects"].values()) for i in range(3)]
    high = [max(o["max"][i] for o in result["objects"].values()) for i in range(3)]
    result["overall_blender_xyz"] = [high[i]-low[i] for i in range(3)]
    result["overall_gltf_xyz"] = [high[0]-low[0], high[2]-low[2], high[1]-low[1]]
    result["triangles"] = sum(o["triangles"] for o in result["objects"].values())
    chassis_vertices = []
    for name, material in (("StainlessFrame", "MAT_StainlessSteel"), ("PhoneBody", "MAT_PhoneBody"),
                           ("FrontGlass", "MAT_FrontGlass"), ("BackGlass", "MAT_BackGlass")):
        obj = next(o for o in objects if o.name == name)
        indices = {v for p in obj.data.polygons
                   if obj.data.materials[p.material_index].name.split(".")[0] == material for v in p.vertices}
        chassis_vertices.extend(obj.matrix_world @ obj.data.vertices[i].co * 1000 for i in indices)
    cmin = [min(v[i] for v in chassis_vertices) for i in range(3)]
    cmax = [max(v[i] for v in chassis_vertices) for i in range(3)]
    result["chassis_gltf_xyz"] = [cmax[0]-cmin[0], cmax[2]-cmin[2], cmax[1]-cmin[1]]
    result["chassis_center_gltf"] = [(cmax[i]+cmin[i])/2 for i in (0, 2, 1)]
    result["chassis_failures"] = []
    if any(abs(v-target)>1e-4 for v,target in zip(result["chassis_gltf_xyz"], (58.6,115.2,9.3))):
        result["chassis_failures"].append("non-canonical structural envelope")
    frame_top = result["objects"]["StainlessFrame"]["max"][2]
    power = result["objects"]["PowerButton"]
    result["power_protrusion_mm"] = {"unpressed": power["max"][2]-frame_top,
        "pressed": power["max"][2]-0.16-frame_top, "seated_depth": frame_top-power["min"][2]}
    # Direct-front occlusion-aware ray sampling, 2 micrometre step. Count only
    # the nearest flat steel surface, not glass/support or the outer bevel.
    def flat_steel(x, z):
        hits = []
        for name, (_, _, tree) in surfaces.items():
            location, normal, _, distance = tree.ray_cast(Vector((x,-20,z)), Vector((0,1,0)), 40)
            if location is not None: hits.append((distance, name, normal))
        if not hits: return False
        _, name, normal = min(hits, key=lambda hit: hit[0])
        return name == "StainlessFrame" and normal.y < -0.999
    samples = {"right": (29.3,0,1,0), "left": (-29.3,0,-1,0),
               "top": (0,57.6,0,1), "bottom": (0,-57.6,0,-1)}
    for sx in (-1,1):
        for sz in (-1,1):
            unit = math.sqrt(0.5)
            samples[f"corner_{sx}_{sz}"] = (sx*(22.3+7*unit),sz*(50.6+7*unit),sx*unit,sz*unit)
    result["front_flat_steel_mm"] = {name: sum(flat_steel(x-d*dx,z-d*dz) for d in
        (i*0.002+0.001 for i in range(500)))*0.002 for name,(x,z,dx,dz) in samples.items()}
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args(sys.argv[sys.argv.index("--")+1:])
    bpy.ops.object.select_all(action="SELECT"); bpy.ops.object.delete(use_global=False)
    bpy.ops.import_scene.gltf(filepath=args.input)
    result = audit_scene()
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    Path(args.output).write_text(json.dumps(result, indent=2, sort_keys=True)+"\n")
    print(json.dumps({k: v for k, v in result.items() if k != "objects"}, indent=2))
