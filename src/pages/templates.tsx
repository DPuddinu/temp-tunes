import { useRef, useState } from "react";
import MainLayout from "~/components/MainLayout";
import type { PageWithLayout } from "~/types/page-types";
import type {
  TemplateSchemaEntryType,
  TemplateSchemaType,
} from "~/types/zod-schemas";

const Templates: PageWithLayout = () => {
  return (
    <div>
      <CreateTemplate />
    </div>
  );
};

Templates.getLayout = (page) => <MainLayout>{page}</MainLayout>;
export default Templates;

function CreateTemplate() {
  const [template, setTemplate] = useState<TemplateSchemaType>();
  const [entries, setEntries] = useState<TemplateSchemaEntryType[]>([]);
  const entryRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-60 flex flex-col justify-between gap-2 rounded-xl bg-base-200 p-2">
      <div className="flex w-full flex-col gap-2">
        <input
          ref={nameRef}
          type="text"
          placeholder="Template Name"
          className="input-ghost input w-full max-w-xs text-xl"
        />
        {entries.map((entry, i) => (
          <button className="btn w-full bg-base-100 " key={i}>
            {entry.entry}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          ref={entryRef}
          type="text"
          placeholder="Template Entry"
          className="input w-full max-w-xs grow"
        />
        <button
          className="btn-circle btn bg-base-100 p-2 text-xl"
          onClick={() => {
            if (entryRef.current !== null) {
              setEntries((entries) => [
                ...entries,
                { entry: entryRef.current?.value ?? "" }
              ]);
            }
          }}
        >
          +
        </button>
      </div>
      <button className="btn w-full bg-base-100 disabled:bg-warning disabled:text-black">
        Confirm
      </button>
    </div>
  );
}
