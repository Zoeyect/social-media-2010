import { FOURSQUARE_VENUE_TIPS } from "./foursquareContent";

export type FoursquareVenueTodoItem = Readonly<{
  id: string;
  kind: "venue";
  venueId: string;
  createdAt: number;
  completed: boolean;
}>;

export type FoursquareTipTodoItem = Readonly<{
  id: string;
  kind: "tip";
  tipId: string;
  venueId: string;
  createdAt: number;
  completed: boolean;
}>;

export type FoursquareTodoItem = FoursquareVenueTodoItem | FoursquareTipTodoItem;

export function getFoursquareVenueTodoId(venueId: string): string {
  return `todo:venue:${venueId}`;
}

export function getFoursquareTipTodoId(tipId: string): string {
  return `todo:tip:${tipId}`;
}

export function createFoursquareVenueTodo(venueId: string, createdAt: number): FoursquareVenueTodoItem {
  return {
    id: getFoursquareVenueTodoId(venueId),
    kind: "venue",
    venueId,
    createdAt,
    completed: false,
  };
}

export function createFoursquareTipTodo(tipId: string, createdAt: number): FoursquareTipTodoItem | null {
  const tip = FOURSQUARE_VENUE_TIPS.find(candidate => candidate.id === tipId);
  return tip ? {
    id: getFoursquareTipTodoId(tip.id),
    kind: "tip",
    tipId: tip.id,
    venueId: tip.venueId,
    createdAt,
    completed: false,
  } : null;
}

export function sortFoursquareTodos(todos: readonly FoursquareTodoItem[]): FoursquareTodoItem[] {
  return [...todos].sort((left, right) => right.createdAt - left.createdAt || left.id.localeCompare(right.id));
}

export function getFoursquareTodoById(todos: readonly FoursquareTodoItem[], todoId: string): FoursquareTodoItem | undefined {
  return todos.find(todo => todo.id === todoId);
}

export function getFoursquareVenueTodo(todos: readonly FoursquareTodoItem[], venueId: string): FoursquareVenueTodoItem | undefined {
  return todos.find((todo): todo is FoursquareVenueTodoItem => todo.kind === "venue" && todo.venueId === venueId);
}

export function getFoursquareTipTodo(todos: readonly FoursquareTodoItem[], tipId: string): FoursquareTipTodoItem | undefined {
  return todos.find((todo): todo is FoursquareTipTodoItem => todo.kind === "tip" && todo.tipId === tipId);
}

export function isFoursquareVenueTodoSaved(todos: readonly FoursquareTodoItem[], venueId: string): boolean {
  return Boolean(getFoursquareVenueTodo(todos, venueId));
}

export function isFoursquareTipTodoSaved(todos: readonly FoursquareTodoItem[], tipId: string): boolean {
  return Boolean(getFoursquareTipTodo(todos, tipId));
}

export function getActiveFoursquareTodos(todos: readonly FoursquareTodoItem[]): FoursquareTodoItem[] {
  return sortFoursquareTodos(todos.filter(todo => !todo.completed));
}

export function getCompletedFoursquareTodos(todos: readonly FoursquareTodoItem[]): FoursquareTodoItem[] {
  return sortFoursquareTodos(todos.filter(todo => todo.completed));
}
