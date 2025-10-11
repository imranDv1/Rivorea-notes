/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  EditorContent,
  EditorContext,
  useEditor,
  JSONContent,
} from "@tiptap/react";
import DragHandle from "@tiptap/extension-drag-handle";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button";
import { buttonVariants, Button as ShadcnButton } from "@/components/ui/button";
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover";
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/components/tiptap-icons/link-icon";

// --- Hooks ---
import { useIsMobile } from "@/hooks/use-mobile";
import { useWindowSize } from "@/hooks/use-window-size";
import { useCursorVisibility } from "@/hooks/use-cursor-visibility";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";
import { CornerDownLeft, Loader2, Save } from "lucide-react";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";
import { toast } from "sonner";
import { JsonValue } from "@/lib/generated/prisma/runtime/library";
import Link from "next/link";
import CustomButton from "@/components/CustomButton";
import { useEditorNotificationStore } from "@/context/simpleEditorupddate";
import { file } from "zod";

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
  onSave: () => void;
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />
      <ToolbarGroup>
        <ImageUploadButton />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}
    </>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link";
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
);

type EditorProps = {
  noteId: string;
  content?: JsonValue;
  editable?: boolean;
  MAX_CHARS: number;
  limit: number;
};

export function SimpleEditor({
  noteId,
  content,
  MAX_CHARS,
  limit,
}: EditorProps) {
  const isMobile = useIsMobile();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main");
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const triggerEditorRefresh = useEditorNotificationStore(
    (state) => state.triggerEditorRefresh
  );
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
  const [edit, setEdit] = React.useState(
    !content ||
      (typeof content === "object" && Object.keys(content).length === 0)
  );

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editable: edit, // initial value
    content: (() => {
      if (!content) return "";
      if (typeof content === "string") return content;
      try {
        return content as JSONContent;
      } catch {
        return "";
      }
    })(),
    editorProps: {
      attributes: {
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: { openOnClick: false, enableClickSelection: true },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: limit,
        upload: async (file: File) => {
          const { previewUrl, file: originalFile } = await handleImageUpload(
            file
          );
          setUploadedFiles((prev) => [...prev, originalFile]);
          return previewUrl;
        },
        onError: (error) => console.error("Upload failed:", error),
      }),
      DragHandle.configure({
        render: () => {
          const span = document.createElement("span");
          span.className = "drag-handle";
          span.textContent = "⋮⋮";
          return span;
        },
      }),
    ],
  });

  const [charCount, setCharCount] = React.useState(0);
  React.useEffect(() => {
    if (!editor) return;

    const checkMaxContent = ({ transaction }: any) => {
      const textLength = editor.getText().length;
      if (textLength > MAX_CHARS) {
        transaction.deleteRange({ from: MAX_CHARS, to: textLength });
        toast.error(`Maximum content length is ${MAX_CHARS} characters!`);
      }
    };

    editor.on("transaction", checkMaxContent);

    return () => {
      editor.off("transaction", checkMaxContent);
    };
  }, [editor]);

  // 🔑 Sync editor editable with `edit`
  React.useEffect(() => {
    if (editor) {
      editor.setEditable(edit);
    }
  }, [edit, editor]);

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  React.useEffect(() => {
    if (!editor) return;

    const updateCharCount = () => {
      setCharCount(editor.getText().length);
    };

    editor.on("transaction", updateCharCount);
    // initialize count
    updateCharCount();

    return () => {
      editor.off("transaction", updateCharCount);
    };
  }, [editor]);

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") setMobileView("main");
  }, [isMobile, mobileView]);

  const [SaveLoading, setLoading] = React.useState(false);

  const handleSave = async () => {
    if (!editor) return;
    const contentLength = editor.getText().length;
    if (contentLength > MAX_CHARS) {
      toast.error(
        `Cannot save! Maximum allowed content is ${MAX_CHARS} characters.`
      );
      return;
    }

    const contentJSON = JSON.stringify(editor.getJSON());
    setLoading(true);
    const formData = new FormData();
    formData.append("noteId", noteId);
    formData.append("content", contentJSON);

    for (const file of uploadedFiles) {
      formData.append("images", file);
    }

    const res = await fetch("/api/note-body", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Note saved successfully!");
      setLoading(false);

      triggerEditorRefresh();
    } else {
      toast.error("Error: " + data.error);
      setLoading(false);
    }
  };

  return (
    <div className="w-[95%]">
      <div className="w-full flex justify-end gap-4 items-center">
        {content ? (
          <div className="flex items-center gap-5">
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/dashboard/create"
            >
              <CornerDownLeft />
            </Link>
            <ShadcnButton variant="outline" onClick={() => setEdit(!edit)}>
              {edit ? "Close Edit" : "Edit"}
            </ShadcnButton>
          </div>
        ) : (
          <>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/dashboard/create"
            >
              <CornerDownLeft />
            </Link>
          </>
        )}

        {edit ? (
          <div className="flex items-center gap-4 ">
            <span
              className={`text-sm ${
                charCount > MAX_CHARS ? "text-red-500" : "text-primary"
              }`}
            >
              {charCount}/{MAX_CHARS}
            </span>
            {/* <CustomButton /> */}

            <button
              onClick={() => toast.error("AI is still in development.")}
              className="hover:cursor-pointer group relative dark:bg-neutral-800 bg-neutral-200 p-px overflow-hidden rounded-xl"
            >
              {/* 🌟 Fancy background */}
              <span className="absolute inset-0 overflow-hidden">
                <span className="inset-0 absolute pointer-events-none select-none">
                  <span
                    className="block -translate-x-1/2 -translate-y-1/3 size-24 blur-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))",
                    }}
                  />
                </span>
              </span>

              <span
                className="inset-0 absolute pointer-events-none select-none"
                style={{
                  animation:
                    "10s ease-in-out infinite alternate border-glow-translate",
                }}
              >
                <span
                  className="block z-0 h-full w-12 blur-xl -translate-x-1/2"
                  style={{
                    animation:
                      "10s ease-in-out infinite alternate border-glow-scale",
                    background:
                      "linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))",
                  }}
                />
              </span>

              {/* Button inner content */}
              <span className="flex items-center justify-center gap-1 relative z-[1] dark:bg-neutral-950/90 bg-neutral-50/90 py-2 px-4 pl-2 w-full rounded-xl">
                <span className="relative group-hover:scale-105 transition-transform group-hover:rotate-[360deg] duration-500">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="opacity-80 dark:opacity-100"
                  >
                    <path
                      d="M11.5 2.3c.05-.1.12-.2.2-.25.08-.05.18-.08.28-.08s.2.03.28.08c.08.05.15.15.2.25l2.3 4.7c.15.3.38.57.66.77.28.2.61.34.96.38l5.2.76c.1.02.2.07.27.13.07.06.13.15.16.24.03.09.04.2.01.29a.55.55 0 0 1-.18.27l-3.74 3.64c-.25.24-.43.53-.52.85-.1.32-.12.66-.06.99l.88 5.14c.02.1.01.21-.03.31-.04.1-.1.18-.19.25a.52.52 0 0 1-.33.1c-.1 0-.2-.02-.29-.07l-4.6-2.42a2.3 2.3 0 0 0-2.33 0l-4.6 2.42c-.09.05-.19.07-.29.07a.52.52 0 0 1-.33-.1c-.09-.07-.15-.16-.19-.25-.04-.1-.05-.21-.03-.31l.88-5.14c.06-.33.03-.67-.06-.99a2.3 2.3 0 0 0-.52-.85L2 9.8a.55.55 0 0 1-.18-.27.58.58 0 0 1 .01-.29c.03-.09.09-.18.16-.24.07-.06.17-.11.27-.13l5.2-.76c.35-.05.68-.18.96-.38.28-.2.51-.47.66-.77l2.3-4.7Z"
                      fill="url(#grad)"
                      stroke="url(#grad)"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient
                        id="grad"
                        x1="0"
                        y1="0"
                        x2="24"
                        y2="24"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#7A69F9" />
                        <stop offset="0.5" stopColor="#F26378" />
                        <stop offset="1" stopColor="#F5833F" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <span className="ml-1.5 text-xs bg-gradient-to-b dark:from-white dark:to-white/50 from-neutral-950 to-neutral-950/50 bg-clip-text text-transparent group-hover:scale-105 transition transform-gpu">
                  AI
                </span>
              </span>
            </button>

            <ShadcnButton disabled={SaveLoading} size="sm" onClick={handleSave}>
              {SaveLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving....</span>
                </>
              ) : (
                <>
                  <Save /> Save
                </>
              )}
            </ShadcnButton>
          </div>
        ) : null}
      </div>
      <EditorContext.Provider value={{ editor }}>
        {edit && (
          <Toolbar
            ref={toolbarRef}
            style={{
              ...(isMobile
                ? { bottom: `calc(100% - ${height - rect.y}px)` }
                : {}),
            }}
          >
            {mobileView === "main" ? (
              <MainToolbarContent
                onHighlighterClick={() => setMobileView("highlighter")}
                onLinkClick={() => setMobileView("link")}
                isMobile={isMobile}
                onSave={handleSave}
              />
            ) : (
              <MobileToolbarContent
                type={mobileView === "highlighter" ? "highlighter" : "link"}
                onBack={() => setMobileView("main")}
              />
            )}
          </Toolbar>
        )}

        <EditorContent
          editor={editor}
          role="presentation"
          className="w-[99%] mt-2"
        />
      </EditorContext.Provider>
    </div>
  );
}
