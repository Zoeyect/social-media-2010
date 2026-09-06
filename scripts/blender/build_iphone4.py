#!/usr/bin/env python3
"""Build, render, export, and validate the SM2010 black iPhone 4 Hero asset.

Run with:
  /Applications/Blender.app/Contents/MacOS/Blender --background --python \
    scripts/blender/build_iphone4.py

The model is authored in Blender's Z-up coordinates with its front facing -Y.
Blender's glTF exporter converts that to the required +Y-up, +Z-front glTF
orientation. Dimensions are in meters and are based on Apple's published
iPhone 4 envelope: 58.6 x 115.2 x 9.3 mm.
"""

from __future__ import annotations

import json
import math
import os
import bmesh
import struct
import sys
from pathlib import Path

import bpy
import numpy as np
from mathutils import Vector


REPO_ROOT = Path(__file__).resolve().parents[2]
OUTPUT_GLB = REPO_ROOT / "src/assets/hero/iphone4/iphone4.glb"
PREVIEW_DIR = REPO_ROOT / "src/assets/hero/iphone4/working/previews"

PHONE_WIDTH = 0.0586
PHONE_HEIGHT = 0.1152
PHONE_DEPTH = 0.0093
FRAME_RADIUS = 0.0078
FRAME_DEPTH = 0.0071
FRONT_LIP_Y = -0.00450

REQUIRED_MESHES = (
    "PhoneBody",
    "StainlessFrame",
    "FrontGlass",
    "BackGlass",
    "Screen",
    "HomeButton",
    "PowerButton",
    "VolumeUp",
    "VolumeDown",
    "MuteSwitch",
    "RearCamera",
    "RearFlash",
    "FrontCamera",
    "Earpiece",
    "HeadphoneJack",
    "Dock30Pin",
    "AntennaBreaks",
    "BottomSpeakerOpenings",
    "BottomMicrophoneOpenings",
)

MATERIAL_NAMES = (
    "MAT_PhoneBody",
    "MAT_StainlessSteel",
    "MAT_FrontGlass",
    "MAT_BackGlass",
    "MAT_Screen",
    "MAT_ButtonMetal",
    "MAT_CameraLens",
    "MAT_Flash",
    "MAT_DarkAperture",
    "MAT_AntennaBreak",
    "MAT_RearEtching",
    "MAT_RearLogo",
)


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials,
                       bpy.data.cameras, bpy.data.lights):
        for datablock in list(datablocks):
            if datablock.users == 0:
                datablocks.remove(datablock)


def set_input(node, name: str, value) -> None:
    if node is None:
        raise RuntimeError("Required Principled BSDF node was not created")
    socket = node.inputs.get(name)
    if socket is not None:
        socket.default_value = value


def make_material(
    name: str,
    color: tuple[float, float, float, float],
    *,
    metallic: float = 0.0,
    roughness: float = 0.5,
    coat: float = 0.0,
    coat_roughness: float = 0.2,
    anisotropy: float = 0.0,
    specular: float = 0.3,
) -> bpy.types.Material:
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    material.diffuse_color = color
    bsdf = next(
        (node for node in material.node_tree.nodes if node.type == "BSDF_PRINCIPLED"),
        None,
    )
    set_input(bsdf, "Base Color", color)
    set_input(bsdf, "Metallic", metallic)
    set_input(bsdf, "Roughness", roughness)
    set_input(bsdf, "IOR", 1.46)
    set_input(bsdf, "Specular IOR Level", specular)
    set_input(bsdf, "Coat Weight", coat)
    set_input(bsdf, "Coat Roughness", coat_roughness)
    set_input(bsdf, "Anisotropic", anisotropy)
    return material


def rear_logo_decal() -> bpy.types.Object:
    """Use the supplied raster, never reconstruct or trace its silhouette."""
    source = bpy.data.images.load(str(OUTPUT_GLB.parent / "refs/applelogo.png"), check_existing=False)
    source.colorspace_settings.name = "Non-Color"
    width, height = source.size
    pixels = np.array(source.pixels[:], dtype=np.float32).reshape(height, width, 4)
    # The supplied image is white-on-black. Preserve its antialiased coverage
    # as alpha, including the original bite and detached leaf proportions.
    alpha = pixels[:, :, :3].mean(axis=2) * pixels[:, :, 3]
    ys, xs = np.nonzero(alpha > 0.5)
    x0, x1 = max(0, xs.min()-2), min(width, xs.max()+3)
    y0, y1 = max(0, ys.min()-2), min(height, ys.max()+3)
    crop = alpha[y0:y1, x0:x1]
    rgba = np.ones((*crop.shape, 4), dtype=np.float32)
    rgba[:, :, 3] = crop
    mask = bpy.data.images.new("RearAppleSuppliedMask", width=x1-x0, height=y1-y0, alpha=True)
    mask.pixels.foreach_set(rgba.ravel())
    mask.pack()
    material = make_material("MAT_RearLogo", (0.085, 0.088, 0.092, 1),
        metallic=0.72, roughness=0.30, coat=0.08, coat_roughness=0.12)
    material.surface_render_method = "DITHERED"
    bsdf = next(node for node in material.node_tree.nodes if node.type == "BSDF_PRINCIPLED")
    texture = material.node_tree.nodes.new("ShaderNodeTexImage")
    texture.image = mask
    texture.extension = "CLIP"
    # Explicit named coordinates survive joining into BackGlass, whose active
    # UV layer is not necessarily the decal's layer.
    coordinates = material.node_tree.nodes.new("ShaderNodeUVMap")
    coordinates.uv_map = "UVMap"
    material.node_tree.links.new(coordinates.outputs["UV"], texture.inputs["Vector"])
    material.node_tree.links.new(texture.outputs["Alpha"], bsdf.inputs["Alpha"])
    # 12.2 mm visible width; isotropic image mapping preserves source aspect.
    scale = 0.0122 / (xs.max()-xs.min()+1)
    w, h = (x1-x0)*scale, (y1-y0)*scale
    mesh = bpy.data.meshes.new("RearAppleDecalData")
    mesh.from_pydata([(-w/2,-h/2,0),(w/2,-h/2,0),(w/2,h/2,0),(-w/2,h/2,0)], [], [(0,1,2,3)])
    uv = mesh.uv_layers.new(name="UVMap")
    for loop, coord in zip(uv.data, ((0,0),(1,0),(1,1),(0,1))):
        loop.uv = coord
    obj = bpy.data.objects.new("RearAppleDecal", mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = (0, 0.00467, 0.029)
    obj.rotation_euler = (math.pi/2, 0, math.pi)
    mesh.materials.append(material)
    print("REAR_LOGO", json.dumps({"visible_width_mm": 12.2,
        "visible_height_mm": float((ys.max()-ys.min()+1)*scale*1000),
        "center_gltf_m": [0, 0.029, -0.00467], "glass_offset_m": 0.00002,
        "mask_pixels": [int(x1-x0), int(y1-y0)]}))
    return obj


def build_materials() -> dict[str, bpy.types.Material]:
    return {
        "MAT_RearEtching": make_material("MAT_RearEtching", (0.085, 0.088, 0.092, 1), metallic=0.72, roughness=0.30, coat=0.08, coat_roughness=0.12),
        "MAT_PhoneBody": make_material(
            "MAT_PhoneBody", (0.001, 0.001, 0.001, 1.0), roughness=0.30
        ),
        "MAT_StainlessSteel": make_material(
            "MAT_StainlessSteel", (0.20, 0.21, 0.22, 1.0), metallic=0.94, roughness=0.36, anisotropy=0.24
        ),
        "MAT_FrontGlass": make_material(
            "MAT_FrontGlass", (0.00035, 0.0004, 0.0005, 1.0),
            roughness=0.11, coat=0.08, coat_roughness=0.10
        ),
        "MAT_BackGlass": make_material(
            "MAT_BackGlass", (0.00035, 0.0004, 0.0005, 1.0),
            roughness=0.12, coat=0.08, coat_roughness=0.10
        ),
        "MAT_Screen": make_material(
            "MAT_Screen", (0.0002, 0.0003, 0.0004, 1.0), metallic=0.0,
            roughness=0.26, coat=0.0, specular=0.10
        ),
        "MAT_ButtonMetal": make_material(
            "MAT_ButtonMetal", (0.16, 0.17, 0.18, 1.0), metallic=0.9, roughness=0.38, anisotropy=0.12
        ),
        "MAT_CameraLens": make_material(
            "MAT_CameraLens", (0.001, 0.002, 0.004, 1.0), metallic=0.10,
            roughness=0.18, coat=0.30, coat_roughness=0.08
        ),
        "MAT_Flash": make_material(
            "MAT_Flash", (0.55, 0.54, 0.49, 1.0), metallic=0.0, roughness=0.48
        ),
        "MAT_DarkAperture": make_material(
            "MAT_DarkAperture", (0.006, 0.007, 0.008, 1.0), metallic=0.02, roughness=0.68
        ),
        "MAT_AntennaBreak": make_material(
            "MAT_AntennaBreak", (0.012, 0.013, 0.014, 1.0), metallic=0.0, roughness=0.72
        ),
    }


def assign_material(obj: bpy.types.Object, material: bpy.types.Material) -> None:
    obj.data.materials.append(material)


def rounded_rect_points(width: float, height: float, radius: float, segments: int) -> list[tuple[float, float]]:
    radius = min(radius, width * 0.5, height * 0.5)
    centers = (
        (width * 0.5 - radius, height * 0.5 - radius, 0.0),
        (-width * 0.5 + radius, height * 0.5 - radius, math.pi * 0.5),
        (-width * 0.5 + radius, -height * 0.5 + radius, math.pi),
        (width * 0.5 - radius, -height * 0.5 + radius, math.pi * 1.5),
    )
    points: list[tuple[float, float]] = []
    for cx, cz, start in centers:
        for index in range(segments + 1):
            angle = start + index * (math.pi * 0.5 / segments)
            points.append((cx + math.cos(angle) * radius, cz + math.sin(angle) * radius))
    return points


def rounded_rect_prism(
    name: str,
    width: float,
    height: float,
    depth: float,
    radius: float,
    location: tuple[float, float, float],
    material: bpy.types.Material,
    *,
    rotation: tuple[float, float, float] = (0.0, 0.0, 0.0),
    segments: int = 10,
    edge_bevel: float = 0.0,
) -> bpy.types.Object:
    outline = rounded_rect_points(width, height, radius, segments)
    half_depth = depth * 0.5
    # Local Y is depth. Front is -Y and back is +Y.
    vertices = [(x, -half_depth, z) for x, z in outline]
    vertices += [(x, half_depth, z) for x, z in outline]
    count = len(outline)
    faces: list[tuple[int, ...]] = []
    faces.append(tuple(reversed(range(count))))
    faces.append(tuple(range(count, count * 2)))
    for index in range(count):
        nxt = (index + 1) % count
        faces.append((index, nxt, count + nxt, count + index))
    mesh = bpy.data.meshes.new(f"{name}Geometry")
    mesh.from_pydata(vertices, [], faces)
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = rotation
    assign_material(obj, material)
    if edge_bevel > 0.0:
        bevel = obj.modifiers.new(name="RestrainedEdgeBevel", type="BEVEL")
        bevel.width = edge_bevel
        bevel.segments = 2
        bevel.limit_method = "ANGLE"
        bevel.harden_normals = True
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=bevel.name)
    return obj


def beveled_box(
    name: str,
    dimensions: tuple[float, float, float],
    location: tuple[float, float, float],
    material: bpy.types.Material,
    *,
    bevel: float = 0.00025,
    segments: int = 3,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    assign_material(obj, material)
    if bevel > 0.0:
        modifier = obj.modifiers.new(name="RestrainedBevel", type="BEVEL")
        modifier.width = bevel
        modifier.segments = segments
        modifier.limit_method = "ANGLE"
        modifier.harden_normals = True
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    return obj


def cylinder(
    name: str,
    radius: float,
    depth: float,
    location: tuple[float, float, float],
    material: bpy.types.Material,
    *,
    axis: str,
    vertices: int = 48,
    bevel: float = 0.00012,
) -> bpy.types.Object:
    rotation = (0.0, 0.0, 0.0)
    if axis == "Y":
        rotation = (math.pi * 0.5, 0.0, 0.0)
    elif axis == "X":
        rotation = (0.0, math.pi * 0.5, 0.0)
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=depth,
        end_fill_type="NGON",
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    assign_material(obj, material)
    if bevel > 0.0:
        modifier = obj.modifiers.new(name="EdgeBevel", type="BEVEL")
        modifier.width = min(bevel, depth * 0.22)
        modifier.segments = 2
        modifier.limit_method = "ANGLE"
        modifier.harden_normals = True
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    return obj


def join_objects(objects: list[bpy.types.Object], name: str) -> bpy.types.Object:
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.join()
    result = bpy.context.object
    result.name = name
    return result


def add_home_button(materials) -> bpy.types.Object:
    button = cylinder(
        "HomeButton", 0.0054, 0.00010, (0.0, -0.00468, -0.0472),
        materials["MAT_PhoneBody"], axis="Y", vertices=64, bevel=0.00010
    )
    glyph_parts = []
    glyph_y = -0.00476
    glyph_mat = materials["MAT_ButtonMetal"]
    # Period-correct rounded-square Home glyph, built as four restrained bars.
    glyph_parts.append(beveled_box("HomeGlyphTop", (0.00355, 0.00010, 0.00028),
                                    (0.0, glyph_y, -0.04535), glyph_mat, bevel=0.00012, segments=2))
    glyph_parts.append(beveled_box("HomeGlyphBottom", (0.00355, 0.00010, 0.00028),
                                    (0.0, glyph_y, -0.04905), glyph_mat, bevel=0.00012, segments=2))
    glyph_parts.append(beveled_box("HomeGlyphLeft", (0.00028, 0.00010, 0.00355),
                                    (-0.00185, glyph_y, -0.0472), glyph_mat, bevel=0.00012, segments=2))
    glyph_parts.append(beveled_box("HomeGlyphRight", (0.00028, 0.00010, 0.00355),
                                    (0.00185, glyph_y, -0.0472), glyph_mat, bevel=0.00012, segments=2))
    return join_objects([button, *glyph_parts], "HomeButton")


def add_volume_button(name: str, z: float, materials, plus: bool) -> bpy.types.Object:
    button = cylinder(
        name, 0.0026, 0.00050, (-0.02940, 0.0, z),
        materials["MAT_ButtonMetal"], axis="X", vertices=56, bevel=0.00010
    )
    glyph_x = -0.02969
    glyph_parts = [
        beveled_box(f"{name}MinusGlyph", (0.00010, 0.00250, 0.00025),
                    (glyph_x, 0.0, z), materials["MAT_AntennaBreak"], bevel=0.00008, segments=2)
    ]
    if plus:
        glyph_parts.append(
            beveled_box(f"{name}PlusGlyph", (0.00010, 0.00025, 0.00250),
                        (glyph_x, 0.0, z), materials["MAT_AntennaBreak"], bevel=0.00008, segments=2)
        )
    return join_objects([button, *glyph_parts], name)


def add_antenna_breaks(materials) -> bpy.types.Object:
    mat = materials["MAT_AntennaBreak"]
    pieces = [
        # The exposed GSM-era band separations: top and two lower side breaks.
        beveled_box("AntennaTop", (0.0005, 0.00712, 0.00010),
                    (-0.0118, 0.0, 0.05758), mat, bevel=0.00002, segments=1),
        beveled_box("AntennaLeftLower", (0.00010, 0.00712, 0.00055),
                    (-0.02930, 0.0, -0.0435), mat, bevel=0.00002, segments=1),
        beveled_box("AntennaRightLower", (0.00010, 0.00712, 0.00055),
                    (0.02930, 0.0, -0.0435), mat, bevel=0.00002, segments=1),
    ]
    return join_objects(pieces, "AntennaBreaks")


def add_bottom_openings(name: str, xs: list[float], materials) -> bpy.types.Object:
    pieces = [
        cylinder(
            f"{name}_{index + 1}", 0.00132, 0.00032,
            (x, 0.0, -0.05772), materials["MAT_DarkAperture"],
            axis="Z", vertices=32, bevel=0.00006
        )
        for index, x in enumerate(xs)
    ]
    return join_objects(pieces, name)


def subtract(target, cutter):
    bpy.context.view_layer.objects.active = target
    modifier = target.modifiers.new("ExteriorRecess", "BOOLEAN")
    modifier.operation = "DIFFERENCE"
    modifier.object = cutter
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    bpy.data.objects.remove(cutter, do_unlink=True)


def rear_text(text, size, z, material):
    curve = bpy.data.curves.new("RearEtching", "FONT")
    curve.body = text
    curve.size = size
    curve.align_x = "CENTER"
    curve.resolution_u = 3
    obj = bpy.data.objects.new("RearEtching", curve)
    bpy.context.collection.objects.link(obj)
    obj.location = (0, 0.00482, z)
    obj.rotation_euler = (math.pi / 2, 0, math.pi)
    curve.materials.append(material)
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.convert(target="MESH")
    return bpy.context.object


def refine_details(objects, materials):
    """Reference-driven exterior details; retain the original 19 semantic nodes."""
    roles = {obj.name: obj for obj in objects}
    metal = materials["MAT_ButtonMetal"]
    dark = materials["MAT_DarkAperture"]
    frame = roles["StainlessFrame"]
    # Real shallow recesses with dark backing, not circles laid on solid steel.
    for name, x, width in (("Dock30Pin", 0, 0.022),
                           ("BottomSpeakerOpenings", 0.021, 0.0084),
                           ("BottomMicrophoneOpenings", -0.021, 0.0084)):
        old = roles[name]
        bpy.data.objects.remove(old, do_unlink=True)
        height = 0.0028 if name == "Dock30Pin" else 0.00165
        cutter = rounded_rect_prism("Cut", width, height, 0.002, height / 2,
            (x, 0, -0.0575), dark, rotation=(math.pi / 2, 0, 0), segments=6)
        subtract(frame, cutter)
        cutter = rounded_rect_prism("BodyCut", width, height, 0.002, height / 2,
            (x, 0, -0.0575), dark, rotation=(math.pi / 2, 0, 0), segments=6)
        subtract(roles["PhoneBody"], cutter)
        backing = rounded_rect_prism(name, width, height, 0.00012, height / 2,
            (x, 0, -0.05665), dark, rotation=(math.pi / 2, 0, 0), segments=6)
        parts = [backing]
        if name != "Dock30Pin":
            for i in range(18):
                parts.append(beveled_box("GrilleWire", (0.00010, 0.0014, 0.00010),
                    (x - 0.0037 + i * 0.000435, 0, -0.05705), metal, bevel=0))
        else:
            parts.append(beveled_box("DockTongue", (0.0194, 0.00055, 0.0003),
                (0, 0.00025, -0.05712), materials["MAT_PhoneBody"], bevel=0.00008))
        roles[name] = join_objects(parts, name)
        if name == "Dock30Pin":
            bpy.context.scene.cursor.location = (0, 0, -0.05775)
            bpy.ops.object.origin_set(type="ORIGIN_CURSOR")
    frame_parts = [frame]
    for x in (-0.0146, 0.0146):
        frame_parts.append(cylinder("BottomScrew", 0.00085, 0.00010,
            (x, 0, -0.05763), metal, axis="Z", vertices=24, bevel=0.00002))
        for dims in ((0.001, 0.00016, 0.00003), (0.00016, 0.001, 0.00003)):
            frame_parts.append(beveled_box("ScrewSlot", dims, (x, 0, -0.05770), dark, bevel=0))
    # SIM tray outline and inset face, on the right side only.
    frame_parts.append(rounded_rect_prism("SIMOutline", 0.0033, 0.0155, 0.00006, 0.0015,
        (0.02932, 0, -0.004), dark, rotation=(0, 0, math.pi/2), segments=6))
    frame_parts.append(rounded_rect_prism("SIMTray", 0.00305, 0.01525, 0.00007, 0.0014,
        (0.02936, 0, -0.004), materials["MAT_StainlessSteel"], rotation=(0, 0, math.pi/2), segments=6))
    frame_parts.append(cylinder("SIMEject", 0.00048, 0.00006,
        (0.02943, 0, -0.0095), dark, axis="X", vertices=24, bevel=0))
    roles["StainlessFrame"] = join_objects(frame_parts, "StainlessFrame")
    for name, radius in (("RearCamera", 0.00305), ("RearFlash", 0.0013), ("FrontCamera", 0.00125)):
        obj = roles[name]
        loc = obj.location.copy()
        front = name == "FrontCamera"
        loc.y = -0.00470 if front else 0.00470
        rim = cylinder("LensRim", radius, 0.00008, loc, metal,
            axis="Y", vertices=48, bevel=0.00002)
        # A smaller lens in front of its rim leaves a thin metal reveal.
        obj.location.y = -0.00478 if front else 0.00478
        roles[name] = join_objects([obj, rim], name)
    ear = roles["Earpiece"]
    bpy.data.objects.remove(ear, do_unlink=True)
    ear = rounded_rect_prism("Earpiece", 0.0104, 0.0017, 0.00012, 0.0008,
        (0, -0.00478, 0.0465), dark, segments=6)
    ear_parts = [ear]
    for i in range(28):
        ear_parts.append(beveled_box("ReceiverMesh", (0.00009, 0.00004, 0.00095),
            (-0.0044 + i * 0.000325, -0.00487, 0.0465), metal, bevel=0))
    roles["Earpiece"] = join_objects(ear_parts, "Earpiece")
    # Top jack: true steel opening with a recessed black bottom.
    jack = roles["HeadphoneJack"]
    subtract(roles["StainlessFrame"], cylinder("JackCut", 0.0018, 0.003,
        (-0.018, 0, 0.0575), dark, axis="Z", vertices=48, bevel=0))
    jack.location.z = 0.0563
    jack.scale.x = jack.scale.y = 0.86
    subtract(roles["PhoneBody"], cylinder("JackBodyCut", 0.0018, 0.003,
        (-0.018, 0, 0.0575), dark, axis="Z", vertices=48, bevel=0))
    # Dark cavity surrounding the short metal mute switch.
    mute = roles["MuteSwitch"]
    cavity = rounded_rect_prism("MuteCavity", 0.0036, 0.0066, 0.00008, 0.0012,
        (-0.02933, 0, 0.041), dark, rotation=(0, 0, math.pi/2), segments=5)
    roles["MuteSwitch"] = join_objects([mute, cavity], "MuteSwitch")
    metal = materials["MAT_RearEtching"]
    marks = [rear_logo_decal()]
    marks.append(rear_text("iPhone", 0.004, -0.029, metal))
    marks.append(rear_text("Designed by Apple in California  Assembled in China", 0.00075, -0.034, metal))
    marks.append(rear_text("Model A1332", 0.00075, -0.036, metal))
    marks.append(rear_text("FCC   CE", 0.0024, -0.041, metal))
    roles["BackGlass"] = join_objects([roles["BackGlass"], *marks], "BackGlass")
    return list(roles.values())


def add_front_frame_lip(frame, material):
    """Expose the existing 0.25 mm glass inset ahead of the black body.

    Orthographic audit: body hid 0.10 mm and the remaining steel was all
    bevel. Keep glass/overall XY outline unchanged; connect a narrow annular
    shoulder to the authored band, not a silver plate beneath the screen.
    Exact shoulder profile is a conservative visual reconstruction.
    """
    outer = rounded_rect_points(PHONE_WIDTH, PHONE_HEIGHT, FRAME_RADIUS, 14)
    inner = rounded_rect_points(0.0580, 0.1146, 0.0075, 14)
    count = len(outer)
    vertices = [(x, y, z) for y in (FRONT_LIP_Y, -0.00350) for ring in (outer, inner) for x, z in ring]
    faces = []
    for i in range(count):
        j = (i + 1) % count
        faces.extend([(i, j, count+j, count+i),
                      (i, 2*count+i, 2*count+j, j),
                      (count+i, count+j, 3*count+j, 3*count+i),
                      (2*count+i, 3*count+i, 3*count+j, 2*count+j)])
    mesh = bpy.data.meshes.new("FrontFrameLipGeometry")
    mesh.from_pydata(vertices, [], faces)
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    bm.to_mesh(mesh)
    bm.free()
    lip = bpy.data.objects.new("FrontFrameLip", mesh)
    bpy.context.collection.objects.link(lip)
    assign_material(lip, material)
    bevel = lip.modifiers.new("LipEdge", "BEVEL")
    bevel.width = 0.000025
    bevel.segments = 2
    bpy.context.view_layer.objects.active = lip
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    return join_objects([frame, lip], "StainlessFrame")


def build_phone() -> bpy.types.Object:
    clear_scene()
    scene = bpy.context.scene
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.length_unit = "METERS"
    scene.unit_settings.scale_length = 1.0
    materials = build_materials()

    root = bpy.data.objects.new("iPhone4", None)
    bpy.context.collection.objects.link(root)
    root.empty_display_type = "PLAIN_AXES"
    root.empty_display_size = 0.012

    objects: list[bpy.types.Object] = []
    objects.append(rounded_rect_prism(
        "StainlessFrame", PHONE_WIDTH, PHONE_HEIGHT, FRAME_DEPTH, FRAME_RADIUS,
        (0.0, 0.0, 0.0), materials["MAT_StainlessSteel"], segments=14, edge_bevel=0.00018
    ))
    objects.append(rounded_rect_prism(
        "PhoneBody", 0.0583, 0.1149, 0.0089, 0.00765,
        (0.0, 0.0, 0.0), materials["MAT_PhoneBody"], segments=13, edge_bevel=0.00016
    ))
    objects.append(rounded_rect_prism(
        "FrontGlass", 0.0581, 0.1147, 0.0006, 0.00755,
        (0.0, -0.00435, 0.0), materials["MAT_FrontGlass"], segments=14, edge_bevel=0.00008
    ))
    objects.append(rounded_rect_prism(
        "BackGlass", 0.0581, 0.1147, 0.0006, 0.00755,
        (0.0, 0.00435, 0.0), materials["MAT_BackGlass"], segments=14, edge_bevel=0.00008
    ))
    objects.append(rounded_rect_prism(
        "Screen", 0.04930, 0.07395, 0.00004, 0.00005,
        (0.0, -0.00468, 0.0010), materials["MAT_Screen"], segments=3, edge_bevel=0.000008
    ))
    objects.append(add_home_button(materials))

    objects.append(rounded_rect_prism(
        "PowerButton", 0.0104, 0.0026, 0.00050, 0.0012, (0.0158, 0, 0.05770),
        materials["MAT_ButtonMetal"], rotation=(math.pi/2, 0, 0), segments=6, edge_bevel=0.00006
    ))
    objects.append(add_volume_button("VolumeUp", 0.0295, materials, plus=True))
    objects.append(add_volume_button("VolumeDown", 0.0192, materials, plus=False))
    objects.append(beveled_box(
        "MuteSwitch", (0.00040, 0.0025, 0.0055), (-0.02945, 0.0, 0.041),
        materials["MAT_ButtonMetal"], bevel=0.00030, segments=3
    ))

    objects.append(cylinder(
        "RearCamera", 0.0028, 0.00010, (0.0211, 0.00475, 0.0490),
        materials["MAT_CameraLens"], axis="Y", vertices=64, bevel=0.00006
    ))
    objects.append(cylinder(
        "RearFlash", 0.00115, 0.00010, (0.0148, 0.00475, 0.0490),
        materials["MAT_Flash"], axis="Y", vertices=48, bevel=0.00005
    ))
    objects.append(cylinder(
        "FrontCamera", 0.0012, 0.00010, (-0.0103, -0.00475, 0.0465),
        materials["MAT_CameraLens"], axis="Y", vertices=48, bevel=0.00003
    ))
    objects.append(beveled_box(
        "Earpiece", (0.0104, 0.00010, 0.0017), (0.0, -0.00475, 0.0465),
        materials["MAT_DarkAperture"], bevel=0.00048, segments=5
    ))
    objects.append(cylinder(
        "HeadphoneJack", 0.00205, 0.00030, (-0.0180, 0.00015, 0.05774),
        materials["MAT_DarkAperture"], axis="Z", vertices=56, bevel=0.00005
    ))

    # The connector node keeps a meaningful local origin at the port mouth.
    # Its location is intentionally not applied/baked into vertex coordinates.
    objects.append(rounded_rect_prism(
        "Dock30Pin", 0.0214, 0.00315, 0.00034, 0.00110,
        (0.0, 0.0, -0.05775), materials["MAT_DarkAperture"],
        rotation=(math.pi * 0.5, 0.0, 0.0), segments=5, edge_bevel=0.00005
    ))
    objects.append(add_antenna_breaks(materials))
    objects.append(add_bottom_openings(
        "BottomMicrophoneOpenings", [-0.02415, -0.02055, -0.01695], materials
    ))
    objects.append(add_bottom_openings(
        "BottomSpeakerOpenings", [0.01695, 0.02055, 0.02415], materials
    ))

    objects = refine_details(objects, materials)
    # Do not pass the overlapping shoulder through unrelated port booleans.
    frame_index = next(i for i, obj in enumerate(objects) if obj.name == "StainlessFrame")
    objects[frame_index] = add_front_frame_lip(objects[frame_index], materials["MAT_StainlessSteel"])
    for obj in objects:
        obj.parent = root
        # Keep flat faces flat and let the applied bevels carry highlights.
        for polygon in obj.data.polygons:
            polygon.use_smooth = False

    bpy.context.view_layer.update()
    return root


def select_hierarchy(root: bpy.types.Object) -> None:
    bpy.ops.object.select_all(action="DESELECT")
    root.select_set(True)
    for child in root.children_recursive:
        child.select_set(True)
    bpy.context.view_layer.objects.active = root


def export_glb(root: bpy.types.Object) -> None:
    OUTPUT_GLB.parent.mkdir(parents=True, exist_ok=True)
    select_hierarchy(root)
    bpy.ops.export_scene.gltf(
        filepath=str(OUTPUT_GLB),
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_cameras=False,
        export_lights=False,
        export_animations=False,
        export_skins=False,
        export_morph=False,
    )


def look_at(obj: bpy.types.Object, point: Vector) -> None:
    direction = point - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def setup_preview_scene() -> bpy.types.Object:
    scene = bpy.context.scene
    # Keep all previous camera/light/exposure values; ray tracing avoids
    # Eevee shadow-map precision artifacts on sub-millimeter surface layers.
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 24
    scene.cycles.use_denoising = True
    scene.render.resolution_x = 640
    scene.render.resolution_y = 720
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.color_depth = "8"
    scene.view_settings.look = "AgX - Medium High Contrast"
    scene.world.color = (0.035, 0.038, 0.043)
    world_nodes = scene.world.node_tree if scene.world and scene.world.use_nodes else None
    if scene.world:
        scene.world.use_nodes = True
        background = scene.world.node_tree.nodes.get("Background")
        background.inputs["Color"].default_value = (0.032, 0.036, 0.042, 1.0)
        background.inputs["Strength"].default_value = 0.16

    camera_data = bpy.data.cameras.new("QA_CameraData")
    camera = bpy.data.objects.new("QA_Camera", camera_data)
    bpy.context.collection.objects.link(camera)
    camera_data.type = "ORTHO"
    camera_data.ortho_scale = 0.137
    camera_data.lens = 52
    scene.camera = camera

    lights = (
        ("QA_Key", "AREA", (0.10, -0.18, 0.17), 7.0, 0.15),
        ("QA_Fill", "AREA", (-0.13, -0.10, 0.04), 3.5, 0.13),
        ("QA_Rim", "AREA", (0.12, 0.14, 0.13), 5.0, 0.11),
    )
    for name, kind, location, energy, size in lights:
        light_data = bpy.data.lights.new(f"{name}Data", kind)
        light_data.energy = energy
        light_data.shape = "DISK"
        light_data.size = size
        light = bpy.data.objects.new(name, light_data)
        bpy.context.collection.objects.link(light)
        light.location = location
        look_at(light, Vector((0.0, 0.0, 0.0)))
    return camera


def render_previews() -> None:
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
    camera = setup_preview_scene()
    views = {
        "front": ((0.0, -0.30, 0.0), 0.137),
        "back": ((0.0, 0.30, 0.0), 0.137),
        "left": ((-0.30, 0.0, 0.0), 0.137),
        "right": ((0.30, 0.0, 0.0), 0.137),
        "top": ((0.0, 0.0, 0.30), 0.085),
        "bottom": ((0.0, 0.0, -0.30), 0.085),
        "front-3q": ((0.19, -0.27, 0.12), 0.145),
        "back-3q": ((-0.19, 0.27, 0.12), 0.145),
    }
    for name, (location, scale) in views.items():
        if "--front-only" in sys.argv and name not in ("front", "front-3q", "left", "right"):
            continue
        if "--rear-only" in sys.argv and name not in ("back", "back-3q"):
            continue
        camera.location = location
        camera.data.ortho_scale = scale
        look_at(camera, Vector((0.0, 0.0, 0.0)))
        bpy.context.scene.render.filepath = str(PREVIEW_DIR / f"{name}.png")
        bpy.ops.render.render(write_still=True)


def world_bounds(objects: list[bpy.types.Object]) -> tuple[Vector, Vector]:
    minimum = Vector((float("inf"),) * 3)
    maximum = Vector((float("-inf"),) * 3)
    for obj in objects:
        for corner in obj.bound_box:
            point = obj.matrix_world @ Vector(corner)
            minimum.x = min(minimum.x, point.x)
            minimum.y = min(minimum.y, point.y)
            minimum.z = min(minimum.z, point.z)
            maximum.x = max(maximum.x, point.x)
            maximum.y = max(maximum.y, point.y)
            maximum.z = max(maximum.z, point.z)
    return minimum, maximum


def validate_export() -> dict:
    raw = OUTPUT_GLB.read_bytes()
    gltf = json.loads(raw[20:20 + struct.unpack_from("<I", raw, 12)[0]])
    nodes = {node["name"]: node for node in gltf["nodes"]}
    assert nodes["Screen"]["translation"][2] > 0, "glTF screen must face +Z"
    assert nodes["PowerButton"]["translation"][1] > 0, "glTF top must be +Y"
    assert abs(nodes["Dock30Pin"]["translation"][1] + .05775) < 1e-6
    assert not any(gltf.get(key) for key in ("animations", "skins", "cameras"))
    assert len(gltf.get("images", [])) == len(gltf.get("textures", [])) == 1
    logo_material = next(m for m in gltf["materials"] if m["name"] == "MAT_RearLogo")
    assert "baseColorTexture" in logo_material["pbrMetallicRoughness"]
    assert logo_material["pbrMetallicRoughness"]["baseColorTexture"].get("texCoord", 0) >= 0
    assert logo_material.get("alphaMode") in ("BLEND", "MASK")
    assert "KHR_draco_mesh_compression" not in gltf.get("extensionsUsed", [])
    clear_scene()
    bpy.ops.import_scene.gltf(filepath=str(OUTPUT_GLB))
    bpy.context.view_layer.update()
    mesh_objects = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    mesh_names = {obj.name for obj in mesh_objects}
    missing = sorted(set(REQUIRED_MESHES) - mesh_names)
    materials = {slot.material.name for obj in mesh_objects for slot in obj.material_slots if slot.material}
    triangles = sum(len(obj.data.polygons) for obj in mesh_objects)
    min_corner, max_corner = world_bounds(mesh_objects)
    dimensions = max_corner - min_corner
    center = (min_corner + max_corner) * 0.5
    frame = bpy.data.objects.get("StainlessFrame")
    screen = bpy.data.objects.get("Screen")
    power = bpy.data.objects.get("PowerButton")
    dock = bpy.data.objects.get("Dock30Pin")
    root = bpy.data.objects.get("iPhone4")
    independent = {
        "Screen": bool(screen and screen.type == "MESH"),
        "PowerButton": bool(power and power.type == "MESH"),
        "Dock30Pin": bool(dock and dock.type == "MESH"),
    }
    hierarchy_ok = bool(root and all(bpy.data.objects[name].parent == root for name in REQUIRED_MESHES if name in bpy.data.objects))
    dock_anchor = tuple(round(value, 7) for value in dock.location) if dock else None
    frame_dimensions = tuple(round(value, 7) for value in frame.dimensions) if frame else None
    result = {
        "required_mesh_count": len(REQUIRED_MESHES),
        "mesh_object_count": len(mesh_objects),
        "scene_object_count": len(bpy.context.scene.objects),
        "material_count": len(materials),
        "materials": sorted(materials),
        "triangles": triangles,
        "missing_required_or_optional_roles": missing,
        "hierarchy_ok": hierarchy_ok,
        "independently_addressable": independent,
        "frame_dimensions_blender_xyz_m": frame_dimensions,
        "overall_dimensions_blender_xyz_m": tuple(round(value, 7) for value in dimensions),
        "overall_center_blender_xyz_m": tuple(round(value, 7) for value in center),
        "screen_is_on_front_negative_y": bool(screen and screen.location.y < 0.0),
        "dock_anchor_blender_xyz_m": dock_anchor,
        "glb_bytes": OUTPUT_GLB.stat().st_size,
        "glb_path": str(OUTPUT_GLB),
    }
    failures = []
    if missing:
        failures.append(f"Missing meshes: {missing}")
    if not hierarchy_ok:
        failures.append("Required meshes are not all direct children of iPhone4")
    if not all(independent.values()):
        failures.append(f"Independent-role validation failed: {independent}")
    if set(MATERIAL_NAMES) != materials:
        failures.append(f"Unexpected material assignments: {materials}")
    if len(mesh_objects) != 19 or len(bpy.context.scene.objects) != 20:
        failures.append("Semantic hierarchy object count changed")
    if triangles > 30000:
        failures.append("Triangle budget exceeded")
    if not result["screen_is_on_front_negative_y"]:
        failures.append("Screen is not on Blender -Y / exported glTF +Z front")
    if frame and any(abs(actual - expected) > 0.00045 for actual, expected in zip(
        frame.dimensions, (PHONE_WIDTH, FRAME_DEPTH / 2 - FRONT_LIP_Y, PHONE_HEIGHT)
    )):
        failures.append(f"Frame dimensions drifted: {frame.dimensions[:]} ")
    if failures:
        raise RuntimeError("; ".join(failures))
    return result


def main() -> None:
    print("SM2010_IPHONE4_BUILD_START")
    print(f"Blender: {bpy.app.version_string}")
    print(f"Repository: {REPO_ROOT}")
    root = build_phone()
    render_previews()
    export_glb(root)
    validation = validate_export()
    print("SM2010_IPHONE4_VALIDATION")
    print(json.dumps(validation, indent=2, sort_keys=True))
    print("SM2010_IPHONE4_BUILD_COMPLETE")


if __name__ == "__main__":
    main()
