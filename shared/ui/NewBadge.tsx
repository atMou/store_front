function NewBadge({ isNew }: { isNew?: boolean }) {
  if (!isNew) {
    return null;
  }
  return (
    <div className="absolute bottom-2 left-0 bg-accent-foreground font-bold leading-3 text-black text-xs py-[3px] px-0.5">
      New
    </div>
  );
}

export default NewBadge;
