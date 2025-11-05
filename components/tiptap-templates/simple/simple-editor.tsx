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
import { convertMarkdownHeadingsToHtml } from "@/lib/converMarkdownHeading";
import { authClient } from "@/lib/auth-client";

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
  const imageUploadRef = React.useRef<any>(null);

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
    editable: edit,
    content: (() => {
      if (!content) return "";
      if (typeof content === "string")
        // Convert Markdown headings (#, ##, ###, ...) to HTML <h1>-<h6> before passing to TipTap
        return convertMarkdownHeadingsToHtml(content);
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
          span.className = "drag-handle hidden sm:inline-block";
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

  // Listen for insert requests from the AI dialog and insert at cursor
  React.useEffect(() => {
    if (!editor) return;
    const handleInsert = (e: Event) => {
      const custom = e as CustomEvent<{ text?: string }>;
      const value = custom.detail?.text?.toString();
      if (!value) return;
      // Ensure we are in edit mode and focus the editor
      setEdit(true);
      const codeRegex = /```([\w-]*)\n([\s\S]*?)```/g;
      let lastIndex = 0;
      const parts: Array<{
        type: "text" | "code";
        content: string;
        lang?: string;
      }> = [];
      let match: RegExpExecArray | null;
      while ((match = codeRegex.exec(value)) !== null) {
        if (match.index > lastIndex) {
          parts.push({
            type: "text",
            content: value.slice(lastIndex, match.index),
          });
        }
        parts.push({
          type: "code",
          content: match[2].trimEnd(),
          lang: match[1] || "text",
        });
        lastIndex = codeRegex.lastIndex;
      }
      if (lastIndex < value.length) {
        parts.push({ type: "text", content: value.slice(lastIndex) });
      }

      const chain = editor.chain().focus();
      for (const part of parts) {
        if (part.type === "code") {
          chain.insertContent({
            type: "codeBlock",
            attrs: { language: part.lang },
            content: [{ type: "text", text: part.content }],
          });
        } else if (part.content.trim()) {
          chain.insertContent(part.content);
        }
      }
      chain.run();
      // Scroll editor into view
      try {
        (editor.view.dom as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } catch {}
      toast.success("Added to editor");
    };
    window.addEventListener(
      "rivorea-insert-note",
      handleInsert as EventListener
    );
    return () => {
      window.removeEventListener(
        "rivorea-insert-note",
        handleInsert as EventListener
      );
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
    <div className="w-full flex flex-col items-center mt-4 gap-4">
      <div className="w-full flex lg:flex-row flex-col justify-end gap-4 items-center">
        <div className="w-full lg:w-max flex justify-end">
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
        </div>

        {edit ? (
          <div className="w-full flex items-center justify-end   gap-4 ">
            <span
              className={`text-sm ${
                charCount > MAX_CHARS ? "text-red-500" : "text-primary"
              }`}
            >
              {charCount}/{MAX_CHARS}
            </span>

            <span></span>
            {/* the ai button open dialog 👇 */}
            <CustomButton />

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
          className="w-[100%] mt-2"
        />
      </EditorContext.Provider>
    </div>
  );
}
