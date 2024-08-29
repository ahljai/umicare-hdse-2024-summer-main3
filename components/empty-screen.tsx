export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold text-center">
          AI Doctor Chatting
        </h1>
        <p className="leading-normal text-muted-foreground text-center">
          This is used to chat with AI Doctor, you can ask any health questions.
        </p>
      </div>
    </div>
  )
}