"use client";

import { useState, useRef, useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  LayoutList,
  Columns2,
  Plus,
  ChevronDown,
  Loader2,
  Trash2,
  Pencil,
  Calendar,
  User,
  MessageSquare,
  X,
  Send,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  tasksApi,
  taskNotesApi,
  workspaceApi,
  type Task,
  type TaskStatus,
  type TaskPriority,
  type TaskNote,
  type WorkspaceMember,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_STATUSES: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
  "CANCELLED",
];

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  LOW: "text-slate-400 bg-slate-400/10",
  MEDIUM: "text-amber-400 bg-amber-400/10",
  HIGH: "text-orange-400 bg-orange-400/10",
  URGENT: "text-red-400 bg-red-400/10",
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  TODO: "text-slate-400 bg-slate-400/10",
  IN_PROGRESS: "text-blue-400 bg-blue-400/10",
  IN_REVIEW: "text-violet-400 bg-violet-400/10",
  DONE: "text-emerald-400 bg-emerald-400/10",
  CANCELLED: "text-zinc-500 bg-zinc-500/10",
};

// ─── Task Form Modal ──────────────────────────────────────────────────────────

function TaskFormModal({
  initial,
  onClose,
  members,
}: {
  initial?: Task;
  onClose: () => void;
  members: WorkspaceMember[];
}) {
  const t = useTranslations("tasksPage");
  const queryClient = useQueryClient();
  const isEdit = !!initial;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priority, setPriority] = useState<TaskPriority>(
    initial?.priority ?? "MEDIUM",
  );
  const [dueDate, setDueDate] = useState(
    initial?.dueDate ? initial.dueDate.slice(0, 10) : "",
  );
  const [assigneeId, setAssigneeId] = useState(initial?.assignedTo?.id ?? "");

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const payload = {
        title,
        description: description || undefined,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        assignedToMemberId: assigneeId || undefined,
      };
      if (isEdit) return tasksApi.update(initial.id, payload);
      return tasksApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(isEdit ? t("taskUpdated") : t("taskCreated"));
      onClose();
    },
    onError: () =>
      toast.error(isEdit ? t("taskUpdateFailed") : t("taskCreateFailed")),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            {isEdit ? t("form.editTitle") : t("form.createTitle")}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            {t("form.titleLabel")}
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("form.titlePlaceholder")}
            autoFocus
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            {t("form.descriptionLabel")}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("form.descriptionPlaceholder")}
            rows={3}
            className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Priority */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              {t("form.priorityLabel")}
            </label>
            <div className="relative">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full appearance-none bg-input border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 pr-8"
              >
                {(["LOW", "MEDIUM", "HIGH", "URGENT"] as TaskPriority[]).map(
                  (p) => (
                    <option key={p} value={p}>
                      {t(`priority.${p}`)}
                    </option>
                  ),
                )}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Due date */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              {t("form.dueDateLabel")}
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>

        {/* Assignee */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            {t("form.assigneeLabel")}
          </label>
          {members.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">
              {t("form.noMembers")}
            </p>
          ) : (
            <div className="relative">
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full appearance-none bg-input border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 pr-8"
              >
                <option value="">{t("form.unassigned")}</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name || m.email || t("form.unknownUser")}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("form.cancel")}
          </button>
          <button
            disabled={!title.trim() || isPending}
            onClick={() => mutate()}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:opacity-50 text-white transition-colors flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isPending
              ? isEdit
                ? t("form.saving")
                : t("form.creating")
              : isEdit
                ? t("form.save")
                : t("form.create")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Task Notes Panel ─────────────────────────────────────────────────────────

function TaskNotesPanel({
  task,
  currentMemberId,
}: {
  task: Task;
  currentMemberId?: string;
}) {
  const t = useTranslations("tasksPage");
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [editingNote, setEditingNote] = useState<TaskNote | null>(null);
  const [editContent, setEditContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", task.id, "notes"],
    queryFn: () => taskNotesApi.list(task.id, { limit: 50 }),
  });

  const notes = data?.notes ?? [];

  const { mutate: addNote, isPending: adding } = useMutation({
    mutationFn: () => taskNotesApi.create(task.id, content.trim()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", task.id, "notes"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setContent("");
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    },
    onError: () => toast.error(t("detail.noteUpdateFailed")),
  });

  const { mutate: updateNote } = useMutation({
    mutationFn: () =>
      taskNotesApi.update(task.id, editingNote!.id, editContent.trim()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", task.id, "notes"] });
      toast.success(t("detail.noteUpdated"));
      setEditingNote(null);
    },
    onError: () => toast.error(t("detail.noteUpdateFailed")),
  });

  const { mutate: deleteNote } = useMutation({
    mutationFn: (noteId: string) => taskNotesApi.delete(task.id, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", task.id, "notes"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(t("detail.noteDeleted"));
    },
    onError: () => toast.error(t("detail.noteDeleteFailed")),
  });

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {t("detail.notesTitle")}
        {notes.length > 0 && (
          <span className="ml-2 bg-white/[0.06] px-1.5 py-0.5 rounded-full text-[10px]">
            {notes.length}
          </span>
        )}
      </p>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="skeleton h-10 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {notes.map((note) => {
            const isAuthor = note.memberId === currentMemberId;
            const isEditing = editingNote?.id === note.id;
            return (
              <div key={note.id} className="flex gap-2.5">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-indigo-300">
                  {note.member.user.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-medium text-foreground/80">
                      {note.member.user.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                    {note.editedAt && (
                      <span className="text-[10px] text-muted-foreground italic">
                        · {t("detail.edited")}
                      </span>
                    )}
                    {isAuthor && !isEditing && (
                      <div className="flex items-center gap-1 ml-auto">
                        <button
                          onClick={() => {
                            setEditingNote(note);
                            setEditContent(note.content);
                          }}
                          className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {t("detail.editNote")}
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="text-[10px] text-muted-foreground hover:text-red-400 transition-colors"
                        >
                          {t("detail.deleteNote")}
                        </button>
                      </div>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="flex gap-1.5">
                      <Input
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="text-xs flex-1"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && editContent.trim())
                            updateNote();
                          if (e.key === "Escape") setEditingNote(null);
                        }}
                      />
                      <button
                        onClick={() => editContent.trim() && updateNote()}
                        className="px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs"
                      >
                        {t("detail.addNote")}
                      </button>
                      <button
                        onClick={() => setEditingNote(null)}
                        className="px-2 py-1 rounded-lg bg-muted/50 text-muted-foreground text-xs"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-foreground/70 leading-relaxed">
                      {note.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Add note input */}
      <div className="flex gap-2">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("detail.addNotePlaceholder")}
          className="flex-1 text-xs"
          onKeyDown={(e) => {
            if (e.key === "Enter" && content.trim() && !adding) addNote();
          }}
        />
        <button
          disabled={!content.trim() || adding}
          onClick={() => addNote()}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 disabled:opacity-50 text-xs font-medium transition-colors"
        >
          {adding ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Task Detail Modal ────────────────────────────────────────────────────────

function TaskDetailModal({
  task,
  members,
  onClose,
  onEdit,
}: {
  task: Task;
  members: WorkspaceMember[];
  onClose: () => void;
  onEdit: () => void;
}) {
  const t = useTranslations("tasksPage");
  const queryClient = useQueryClient();
  const [statusOpen, setStatusOpen] = useState(false);
  const [assigneeOpen, setAssigneeOpen] = useState(false);

  const { mutate: updateStatus } = useMutation({
    mutationFn: (status: TaskStatus) => tasksApi.update(task.id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setStatusOpen(false);
    },
  });

  const { mutate: assignTask } = useMutation({
    mutationFn: (memberId: string | null) => tasksApi.assign(task.id, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(t("detail.assignSaved"));
      setAssigneeOpen(false);
    },
    onError: () => toast.error(t("detail.assignFailed")),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full sm:max-w-lg bg-[#111] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-foreground leading-snug">
              {task.title}
            </h2>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onEdit}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2">
          {/* Status selector */}
          <div className="relative">
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors",
                STATUS_COLORS[task.status],
              )}
            >
              {t(`status.${task.status}`)}
              <ChevronDown className="w-3 h-3" />
            </button>
            {statusOpen && (
              <div className="absolute left-0 top-8 z-20 w-40 bg-[#111] border border-white/10 rounded-xl shadow-2xl p-1">
                {ALL_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-xs rounded-lg transition-colors",
                      task.status === s
                        ? "bg-white/[0.08] text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]",
                    )}
                  >
                    {t(`status.${s}`)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Priority */}
          <span
            className={cn(
              "px-2.5 py-1.5 rounded-xl text-xs font-medium",
              PRIORITY_COLORS[task.priority],
            )}
          >
            {t(`priority.${task.priority}`)}
          </span>

          {/* Due date */}
          {task.dueDate && (
            <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white/[0.05] text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <Separator className="bg-white/[0.06]" />

        {/* Assignee */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {t("detail.assignedTo")}
          </span>
          <div className="relative">
            <button
              onClick={() => setAssigneeOpen(!assigneeOpen)}
              className="flex items-center gap-1.5 text-xs text-foreground/80 hover:text-foreground transition-colors"
            >
              {task.assignedTo ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-300">
                    {task.assignedTo.user.name[0]?.toUpperCase()}
                  </div>
                  {task.assignedTo.user.name}
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {t("form.unassigned")}
                  </span>
                </>
              )}
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
            {assigneeOpen && (
              <div className="absolute right-0 top-7 z-20 w-44 bg-[#111] border border-white/10 rounded-xl shadow-2xl p-1">
                <button
                  onClick={() => assignTask(null)}
                  className="w-full text-left px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.06] rounded-lg transition-colors"
                >
                  {t("form.unassigned")}
                </button>
                <Separator className="my-1 bg-white/10" />
                {members.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => assignTask(m.id)}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs text-foreground/80 hover:text-foreground hover:bg-white/[0.06] rounded-lg transition-colors"
                  >
                    <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center text-[9px] font-bold text-indigo-300">
                      {m.name[0]?.toUpperCase()}
                    </div>
                    {m.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Creator */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {t("detail.createdBy")}
          </span>
          <span className="text-xs text-foreground/80">
            {task.createdBy.user.name}
          </span>
        </div>

        <Separator className="bg-white/[0.06]" />

        {/* Notes */}
        <TaskNotesPanel task={task} />
      </div>
    </div>
  );
}

// ─── Task Card (shared across list + kanban) ─────────────────────────────────

function TaskCard({
  task,
  onOpen,
  onEdit,
  onDelete,
  isDragging,
}: {
  task: Task;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}) {
  const t = useTranslations("tasksPage");
  return (
    <div
      className={cn(
        "group p-3.5 rounded-2xl bg-card border border-border hover:border-border/80 transition-all select-none",
        isDragging && "opacity-50 shadow-2xl",
      )}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0" onClick={onOpen}>
          <p className="text-sm font-medium text-foreground/90 leading-snug line-clamp-2">
            {task.title}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span
              className={cn(
                "text-[10px] font-medium px-1.5 py-0.5 rounded",
                PRIORITY_COLORS[task.priority],
              )}
            >
              {t(`priority.${task.priority}`)}
            </span>
            {task.dueDate && (
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Calendar className="w-2.5 h-2.5" />
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            {(task._count?.notes ?? 0) > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <MessageSquare className="w-2.5 h-2.5" />
                {task._count!.notes}
              </span>
            )}
          </div>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={onEdit}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      {/* Assignee */}
      {task.assignedTo && (
        <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-border/40">
          <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center text-[9px] font-bold text-indigo-300">
            {task.assignedTo.user.name[0]?.toUpperCase()}
          </div>
          <span className="text-[10px] text-muted-foreground">
            {task.assignedTo.user.name}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Sortable Task Card (kanban) ───────────────────────────────────────────────

function SortableTaskCard({
  task,
  onOpen,
  onEdit,
  onDelete,
}: {
  task: Task;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "touch-none",
        isDragging ? "cursor-grabbing" : "cursor-grab",
      )}
    >
      <TaskCard
        task={task}
        onOpen={onOpen}
        onEdit={onEdit}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  );
}

// ─── Kanban Column ────────────────────────────────────────────────────────────

function KanbanColumn({
  status,
  tasks,
  onOpen,
  onEdit,
  onDelete,
}: {
  status: TaskStatus;
  tasks: Task[];
  onOpen: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  const t = useTranslations("tasksPage");
  const { setNodeRef } = useSortable({ id: status });

  const columnStyles: Record<
    TaskStatus,
    {
      topBorder: string;
      bg: string;
      headerBg: string;
      titleColor: string;
      badgeBg: string;
      badgeColor: string;
    }
  > = {
    TODO: {
      topBorder: "border-t-slate-400 dark:border-t-slate-500",
      bg: "bg-slate-100/80 dark:bg-slate-500/[0.08]",
      headerBg: "bg-slate-200/50 dark:bg-slate-500/[0.12]",
      titleColor: "text-slate-600 dark:text-slate-300",
      badgeBg: "bg-slate-300/60 dark:bg-slate-400/20",
      badgeColor: "text-slate-600 dark:text-slate-400",
    },
    IN_PROGRESS: {
      topBorder: "border-t-blue-400",
      bg: "bg-blue-50 dark:bg-blue-500/[0.08]",
      headerBg: "bg-blue-100/60 dark:bg-blue-500/[0.12]",
      titleColor: "text-blue-700 dark:text-blue-300",
      badgeBg: "bg-blue-200/60 dark:bg-blue-400/20",
      badgeColor: "text-blue-700 dark:text-blue-400",
    },
    IN_REVIEW: {
      topBorder: "border-t-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/[0.08]",
      headerBg: "bg-amber-100/60 dark:bg-amber-500/[0.12]",
      titleColor: "text-amber-700 dark:text-amber-300",
      badgeBg: "bg-amber-200/60 dark:bg-amber-400/20",
      badgeColor: "text-amber-700 dark:text-amber-400",
    },
    DONE: {
      topBorder: "border-t-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/[0.08]",
      headerBg: "bg-emerald-100/60 dark:bg-emerald-500/[0.12]",
      titleColor: "text-emerald-700 dark:text-emerald-300",
      badgeBg: "bg-emerald-200/60 dark:bg-emerald-400/20",
      badgeColor: "text-emerald-700 dark:text-emerald-400",
    },
    CANCELLED: {
      topBorder: "border-t-red-400",
      bg: "bg-red-50 dark:bg-red-500/[0.08]",
      headerBg: "bg-red-100/60 dark:bg-red-500/[0.12]",
      titleColor: "text-red-700 dark:text-red-300",
      badgeBg: "bg-red-200/60 dark:bg-red-400/20",
      badgeColor: "text-red-700 dark:text-red-400",
    },
  };

  const s = columnStyles[status];

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-shrink-0 w-72 flex flex-col rounded-2xl border border-border border-t-2",
        s.topBorder,
        s.bg,
      )}
    >
      <div
        className={cn(
          "px-3 py-2.5 flex items-center justify-between rounded-t-xl",
          s.headerBg,
        )}
      >
        <span className={cn("text-xs font-semibold", s.titleColor)}>
          {t(`status.${status}`)}
        </span>
        <span
          className={cn(
            "text-[10px] font-semibold px-1.5 py-0.5 rounded",
            s.badgeBg,
            s.badgeColor,
          )}
        >
          {tasks.length}
        </span>
      </div>
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 p-2 space-y-2 min-h-[60px]">
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onOpen={() => onOpen(task)}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task)}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

// ─── List View ────────────────────────────────────────────────────────────────

function TaskListView({
  tasks,
  isLoading,
  onOpen,
  onEdit,
  onDelete,
}: {
  tasks: Task[];
  isLoading: boolean;
  onOpen: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  const t = useTranslations("tasksPage");

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-16 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-muted-foreground">{t("noTasks")}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          {t("createFirst")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border hover:border-border/80 transition-all group cursor-pointer"
          onClick={() => onOpen(task)}
        >
          {/* Status */}
          <span
            className={cn(
              "text-[10px] font-medium px-2 py-1 rounded-lg flex-shrink-0",
              STATUS_COLORS[task.status],
            )}
          >
            {t(`status.${task.status}`)}
          </span>
          {/* Title */}
          <p className="flex-1 text-sm font-medium text-foreground/80 leading-snug truncate">
            {task.title}
          </p>
          {/* Priority */}
          <span
            className={cn(
              "text-[10px] font-medium px-2 py-1 rounded-lg flex-shrink-0 hidden sm:inline",
              PRIORITY_COLORS[task.priority],
            )}
          >
            {t(`priority.${task.priority}`)}
          </span>
          {/* Due date */}
          {task.dueDate && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground flex-shrink-0 hidden md:flex">
              <Calendar className="w-3 h-3" />
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
          {/* Assignee */}
          {task.assignedTo && (
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-300 flex-shrink-0">
              {task.assignedTo.user.name[0]?.toUpperCase()}
            </div>
          )}
          {/* Note count */}
          {(task._count?.notes ?? 0) > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground flex-shrink-0">
              <MessageSquare className="w-3 h-3" />
              {task._count!.notes}
            </span>
          )}
          {/* Actions */}
          <div
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onEdit(task)}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task)}
              className="p-1 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TasksPage() {
  const t = useTranslations("tasksPage");
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ["tasks", { status: statusFilter, limit: 100 }],
    queryFn: () =>
      tasksApi.list({
        limit: 100,
        ...(statusFilter ? { status: statusFilter } : {}),
      }),
  });

  const { data: members = [] } = useQuery({
    queryKey: ["workspace", "members"],
    queryFn: workspaceApi.getMembers,
  });

  const tasks = tasksData?.tasks ?? [];

  const { mutate: deleteTask } = useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(t("taskDeleted"));
    },
    onError: () => toast.error(t("taskDeleteFailed")),
  });

  const { mutate: moveTask } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      tasksApi.update(id, { status }),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previous = queryClient.getQueryData<Task[]>(["tasks"]);
      queryClient.setQueryData<Task[]>(
        ["tasks"],
        (old) => old?.map((t) => (t.id === id ? { ...t, status } : t)) ?? [],
      );
      return { previous };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["tasks"], context?.previous);
      toast.error(t("taskUpdateFailed"));
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(
        t("taskStatusUpdated", { status: t(`status.${variables.status}`) }),
        { icon: "✓" },
      );
    },
  });

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // overId is either a TaskStatus (column) or another task id
    const targetStatus = ALL_STATUSES.includes(overId as TaskStatus)
      ? (overId as TaskStatus)
      : tasks.find((t) => t.id === overId)?.status;

    if (!targetStatus) return;

    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== targetStatus) {
      moveTask({ id: taskId, status: targetStatus });
    }
  };

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  const handleDelete = (task: Task) => {
    if (confirm(t("deleteDesc"))) deleteTask(task.id);
  };

  const handleEdit = (task: Task) => {
    setDetailTask(null);
    setEditingTask(task);
  };

  // Group tasks by status for kanban
  const byStatus = ALL_STATUSES.reduce(
    (acc, s) => {
      acc[s] = tasks.filter((t) => t.status === s);
      return acc;
    },
    {} as Record<TaskStatus, Task[]>,
  );

  return (
    <div className="min-h-full flex flex-col p-5 md:p-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">{t("title")}</h1>
          {tasksData && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {tasksData.pagination.total} total
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/30 border border-border">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                viewMode === "list"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutList className="w-3.5 h-3.5" />
              {t("listView")}
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                viewMode === "kanban"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Columns2 className="w-3.5 h-3.5" />
              {t("kanbanView")}
            </button>
          </div>

          {/* New task */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t("newTask")}</span>
          </button>
        </div>
      </div>

      {/* Status filter (list mode only) */}
      {viewMode === "list" && (
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
          <button
            onClick={() => setStatusFilter("")}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors",
              statusFilter === ""
                ? "bg-indigo-500/20 text-indigo-400"
                : "bg-muted/30 text-muted-foreground hover:text-foreground",
            )}
          >
            {t("allStatuses")}
          </button>
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors",
                statusFilter === s
                  ? cn(STATUS_COLORS[s], "ring-1 ring-current/30")
                  : "bg-muted/30 text-muted-foreground hover:text-foreground",
              )}
            >
              {t(`status.${s}`)}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {viewMode === "list" ? (
        <TaskListView
          tasks={tasks}
          isLoading={isLoading}
          onOpen={setDetailTask}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 md:-mx-8 md:px-8">
            <SortableContext
              items={ALL_STATUSES}
              strategy={verticalListSortingStrategy}
            >
              {ALL_STATUSES.map((status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  tasks={byStatus[status]}
                  onOpen={setDetailTask}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </SortableContext>
          </div>
          <DragOverlay>
            {activeTask && (
              <TaskCard
                task={activeTask}
                onOpen={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
                isDragging
              />
            )}
          </DragOverlay>
        </DndContext>
      )}

      {/* Modals */}
      {(showCreateModal || editingTask) && (
        <TaskFormModal
          initial={editingTask ?? undefined}
          members={members}
          onClose={() => {
            setShowCreateModal(false);
            setEditingTask(null);
          }}
        />
      )}

      {detailTask && (
        <TaskDetailModal
          task={detailTask}
          members={members}
          onClose={() => setDetailTask(null)}
          onEdit={() => handleEdit(detailTask)}
        />
      )}
    </div>
  );
}
