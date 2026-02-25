'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link2, Link2Off } from 'lucide-react'
import { useCallback } from 'react'
import type { JSONContent } from '@/lib/actions/blogs'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

type TipTapEditorProps = {
  content?: JSONContent | null
  onChange?: (content: JSONContent) => void
  editable?: boolean
  placeholder?: string
  className?: string
}

type ToolbarButtonProps = {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
  bubble?: boolean
}

function ToolbarButton({ onClick, active, title, children, bubble }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant={active ? 'secondary' : 'ghost'}
      size="icon"
      className={cn(bubble ? 'h-7 w-7' : 'h-8 w-8')}
      onClick={onClick}
      title={title}
    >
      {children}
    </Button>
  )
}

function ToolbarDivider({ bubble }: { bubble?: boolean }) {
  return (
    <div className={cn('bg-border mx-0.5 w-px', bubble ? 'h-5' : 'h-6')} />
  )
}

export function TipTapEditor({
  content,
  onChange,
  editable = true,
  placeholder = 'Start writing your post…',
  className,
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
    ],
    immediatelyRender: false,
    content: content ?? undefined,
    editable,
    editorProps: {
      attributes: {
        class: 'tiptap-content',
        'data-placeholder': placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON())
    },
  })

  const toggleLink = useCallback(() => {
    if (!editor) return
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run()
      return
    }
    const url = window.prompt('Enter URL')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor) return null

  const iconSize = 'size-3.5'

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Fixed toolbar */}
      {editable && (
        <>
          <div className="flex flex-wrap items-center gap-0.5 px-1 py-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive('bold')}
              title="Bold"
            >
              <Bold className={iconSize} />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive('italic')}
              title="Italic"
            >
              <Italic className={iconSize} />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor.isActive('heading', { level: 2 })}
              title="Heading 2"
            >
              <Heading2 className={iconSize} />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              active={editor.isActive('heading', { level: 3 })}
              title="Heading 3"
            >
              <Heading3 className={iconSize} />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive('bulletList')}
              title="Bullet list"
            >
              <List className={iconSize} />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive('orderedList')}
              title="Ordered list"
            >
              <ListOrdered className={iconSize} />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton
              onClick={toggleLink}
              active={editor.isActive('link')}
              title={editor.isActive('link') ? 'Remove link' : 'Add link'}
            >
              {editor.isActive('link') ? (
                <Link2Off className={iconSize} />
              ) : (
                <Link2 className={iconSize} />
              )}
            </ToolbarButton>
          </div>
          <Separator />
        </>
      )}

      {/* Bubble menu — appears on text selection */}
      <BubbleMenu
        editor={editor}
        className="flex items-center gap-0.5 rounded-lg border bg-popover p-1 shadow-md"
      >
        <ToolbarButton
          bubble
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className={iconSize} />
        </ToolbarButton>

        <ToolbarButton
          bubble
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className={iconSize} />
        </ToolbarButton>

        <ToolbarDivider bubble />

        <ToolbarButton
          bubble
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className={iconSize} />
        </ToolbarButton>

        <ToolbarButton
          bubble
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className={iconSize} />
        </ToolbarButton>

        <ToolbarDivider bubble />

        <ToolbarButton
          bubble
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet list"
        >
          <List className={iconSize} />
        </ToolbarButton>

        <ToolbarDivider bubble />

        <ToolbarButton
          bubble
          onClick={toggleLink}
          active={editor.isActive('link')}
          title={editor.isActive('link') ? 'Remove link' : 'Add link'}
        >
          {editor.isActive('link') ? (
            <Link2Off className={iconSize} />
          ) : (
            <Link2 className={iconSize} />
          )}
        </ToolbarButton>
      </BubbleMenu>

      <EditorContent editor={editor} className="px-1 py-2" />
    </div>
  )
}
