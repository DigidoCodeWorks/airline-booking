import clsx from "clsx";

type BoundedProps = {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
};

export default function Bounded({
  as: Comp = "section",
  className,
  children,
  ...props
}: BoundedProps) {
  return (
    <Comp
      className={clsx("flex items-center justify-center h-screen", className)}
      {...props}
    >
      <div className="bg-white w-[80vw] h-[40vw] mx-auto rounded-xl">
        {children}
      </div>
    </Comp>
  );
}
