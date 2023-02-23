export default function Loading(props: {
  type: "spinner" | "skeleton";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  rowClassName?: string;
  length?: number;
}) {
  const { type, maxWidth, rowClassName, length } = props;

  return (
    <>
      {type === "spinner" ? (
        <div className="flex h-screen items-center justify-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      ) : (
        <div
          className={`border  shadow rounded-md p-5 max-w-${
            maxWidth || "6xl"
          } w-full mx-auto`}
        >
          <div className=" flex space-x-4 animate-pulse ">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-6 bg-slate-500 rounded"></div>
              <div className="space-y-3">
                <div className={`grid grid-cols-3 gap-4 ${rowClassName}`}>
                  {Array(length)
                    .fill("")
                    .map(() => {
                      return (
                        <>
                          <div className="h-4 bg-slate-400 rounded col-span-2"></div>
                          <div className="h-4 bg-slate-400 rounded col-span-1"></div>
                        </>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
