"use strict";
// ---------- 1. Enums, literal types, type aliases ----------
var Priority;
(function (Priority) {
    Priority[Priority["Low"] = 1] = "Low";
    Priority[Priority["Medium"] = 2] = "Medium";
    Priority[Priority["High"] = 3] = "High";
})(Priority || (Priority = {}));
// ---------- 4. Generics + classes + access modifiers ----------
class Store {
    constructor(key, seed) {
        this.key = key;
        this.seed = seed;
        this.items = [];
        this.items = this.read();
    }
    read() {
        try {
            const raw = localStorage.getItem(this.key);
            if (raw)
                return JSON.parse(raw);
        }
        catch (e) { /* storage may be unavailable */ }
        return this.seed();
    }
    save() {
        try {
            localStorage.setItem(this.key, JSON.stringify(this.items));
        }
        catch (e) { }
    }
    get all() { return this.items; }
    add(item) { this.items = [item, ...this.items]; this.save(); }
    update(id, patch) {
        this.items = this.items.map(i => (i.id === id ? { ...i, ...patch } : i));
        this.save();
    }
    remove(id) { this.items = this.items.filter(i => i.id !== id); this.save(); }
    reset() { this.items = this.seed(); this.save(); }
}
function label(p, upper = false) {
    const s = Priority[p];
    return upper ? s.toUpperCase() : s;
}
// ---------- 6. Type guard + union narrowing ----------
function isFilter(v) {
    return v === "all" || v === "todo" || v === "done";
}
// ---------- 7. Starter tasks (the 10 coded tasks) ----------
const mk = (id, title, note, priority, code) => ({ id, title, note, tag: "typescript", priority, status: "todo", code });
function seed() {
    return [
        mk(1, "Basic types", "string, number, boolean, arrays, tuples, any, unknown", Priority.High, `let name: string = "Wahab";
let marks: number[] = [88, 92];
let pair: [string, number] = ["age", 20];
let x: unknown = "hi";
if (typeof x === "string") console.log(x.length);`),
        mk(2, "Interfaces and type aliases", "Describe the shape of objects", Priority.High, `interface User { id: number; name: string; email?: string }
type ID = number | string;
const u: User = { id: 1, name: "Ali" };`),
        mk(3, "Union and intersection types", "Combine types and narrow them", Priority.Medium, `type Result = string | number;
type Admin = User & { role: "admin" };
function show(r: Result) {
  return typeof r === "string" ? r.toUpperCase() : r.toFixed(2);
}`),
        mk(4, "Enums and literal types", "Named constants and fixed string values", Priority.Medium, `enum Dir { Up, Down, Left, Right }
type Mode = "light" | "dark";
let m: Mode = "dark";`),
        mk(5, "Functions", "Optional, default, rest params and overloads", Priority.High, `function greet(name: string, greeting = "Hello", ...rest: string[]): string {
  return greeting + ", " + name + rest.join(" ");
}
const add = (a: number, b: number): number => a + b;`),
        mk(6, "Classes and access modifiers", "public, private, protected, readonly, abstract", Priority.High, `abstract class Shape {
  constructor(protected readonly name: string) {}
  abstract area(): number;
}
class Circle extends Shape {
  constructor(private r: number) { super("circle"); }
  area() { return Math.PI * this.r ** 2; }
}`),
        mk(7, "Generics", "Reusable code with type parameters and constraints", Priority.High, `function first<T>(arr: T[]): T | undefined { return arr[0]; }
function len<T extends { length: number }>(x: T) { return x.length; }
interface Box<T> { value: T }`),
        mk(8, "Utility types", "Partial, Required, Pick, Omit, Record, Readonly", Priority.Medium, `type Draft = Partial<User>;
type Public = Pick<User, "id" | "name">;
const roles: Record<string, number> = { admin: 1, guest: 0 };`),
        mk(9, "Modules and namespaces", "import / export and organising code", Priority.Low, `// math.ts
export const PI = 3.14;
export default function sq(n: number) { return n * n; }
// app.ts
import sq, { PI } from "./math";`),
        mk(10, "Mapped, conditional types and guards", "keyof, typeof, infer, custom type guards", Priority.Medium, `type Flags<T> = { [K in keyof T]: boolean };
type IsString<T> = T extends string ? "yes" : "no";
function isUser(o: any): o is User { return "name" in o; }`),
    ];
}
// ---------- 8. App ----------
const $ = (id) => document.getElementById(id);
const store = new Store("ledger.tasks.v1", seed);
let filter = "all";
let query = "";
function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls)
        n.className = cls;
    if (text !== undefined)
        n.textContent = text;
    return n;
}
function render() {
    const list = $("list");
    list.innerHTML = "";
    const all = store.all;
    const shown = all.filter(t => (filter === "all" || t.status === filter) &&
        (t.title + t.note + t.tag).toLowerCase().includes(query));
    if (!shown.length)
        list.appendChild(el("div", "empty", "Nothing here yet."));
    for (const t of shown) {
        const li = el("li", t.status === "done" ? "done" : "");
        const row = el("div", "row");
        const chk = el("button", "chk", t.status === "done" ? "✓" : "");
        chk.setAttribute("aria-label", "Toggle done");
        chk.onclick = () => { store.update(t.id, { status: t.status === "done" ? "todo" : "done" }); render(); };
        const body = el("div", "body");
        body.appendChild(el("div", "t", t.title));
        if (t.note)
            body.appendChild(el("div", "note", t.note));
        const meta = el("div", "meta", `${t.tag} · `);
        meta.appendChild(el("span", t.priority === Priority.High ? "p3" : "", label(t.priority, true)));
        body.appendChild(meta);
        if (t.code) {
            const d = el("details");
            d.appendChild(el("summary", "", "View code"));
            d.appendChild(el("pre", "", t.code));
            body.appendChild(d);
        }
        const del = el("button", "del", "×");
        del.setAttribute("aria-label", "Delete");
        del.onclick = () => { store.remove(t.id); render(); };
        row.append(chk, body, del);
        li.appendChild(row);
        list.appendChild(li);
    }
    const done = all.filter(t => t.status === "done").length;
    $("sTotal").textContent = String(all.length);
    $("sDone").textContent = String(done);
    $("sOpen").textContent = String(all.length - done);
    $("bar").style.width = (all.length ? (done / all.length) * 100 : 0) + "%";
}
function addTask() {
    const title = $("fTitle").value.trim();
    if (!title) {
        $("fTitle").focus();
        return;
    }
    const input = {
        title,
        note: $("fNote").value.trim(),
        tag: $("fTag").value.trim() || "general",
        priority: Number($("fPri").value),
    };
    store.add({ ...input, id: Date.now(), status: "todo" });
    for (const id of ["fTitle", "fNote", "fTag"])
        $(id).value = "";
    render();
}
$("fAdd").onclick = addTask;
$("fTitle").addEventListener("keydown", (e) => {
    if (e.key === "Enter")
        addTask();
});
$("tools").addEventListener("click", (e) => {
    const f = e.target.dataset.f;
    if (isFilter(f)) {
        filter = f;
        document.querySelectorAll("#tools button").forEach(b => b.classList.toggle("on", b.dataset.f === f));
        render();
    }
});
$("q").addEventListener("input", (e) => {
    query = e.target.value.toLowerCase();
    render();
});
$("reset").onclick = () => { store.reset(); render(); };
$("theme").onclick = () => {
    const root = document.documentElement;
    const dark = root.dataset.theme === "dark" ||
        (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
    root.dataset.theme = dark ? "light" : "dark";
};
render();
