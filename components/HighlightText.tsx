interface HighlightTextProps {
  text: string
  highlight: string
}

export function HighlightText({ text, highlight }: HighlightTextProps) {
  if (!highlight.trim()) {
    return <>{text}</>
  }

  const regex = new RegExp(`(${highlight})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}
