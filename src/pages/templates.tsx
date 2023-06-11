import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Transition } from "@headlessui/react";
import { useRef, useState } from "react";
import { z } from "zod";
import MainLayout from "~/components/MainLayout";
import { LoadingSpinner } from "~/components/ui/LoadingSpinner";
import { ArrowDownSVG } from "~/components/ui/icons/ArrowDownSVG";
import { ArrowUpSVG } from "~/components/ui/icons/ArrowUpSVG";
import { DeleteSVG } from "~/components/ui/icons/DeleteSVG";
import { useStore } from "~/core/store";
import type { PageWithLayout } from "~/types/page-types";
import {
  TemplateEntrySchema,
  type TemplateSchemaEntryType,
} from "~/types/zod-schemas";
import { api } from "~/utils/api";
import { arrayMoveImmutable } from "~/utils/helpers";

const Templates: PageWithLayout = () => {
  return (
    <div>
      <CreateTemplate />
    </div>
  );
};

Templates.getLayout = (page) => <MainLayout>{page}</MainLayout>;
export default Templates;

const TemplateFormSchema = z.object({
  name: z.string().min(3).max(16),
  entries: TemplateEntrySchema.array().min(1),
});

function CreateTemplate() {
  const { setMessage } = useStore();

  const { mutate, isLoading } = api.template.createTemplate.useMutation({
    onError() {
      setMessage("Error");
    },
  });
  const [entries, setEntries] = useState<TemplateSchemaEntryType[]>([]);
  const entryRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const [selectedRow, setSelectedRow] = useState<number | undefined>();
  const [parent] = useAutoAnimate();

  return (
    <div className="min-h-60 flex flex-col justify-between gap-2 rounded-xl bg-base-200 p-2 shadow">
      <div className="flex w-full flex-col gap-2" ref={parent}>
        <div className="flex gap-2">
          <input
            ref={nameRef}
            type="text"
            placeholder="Template Name"
            className="input-ghost input w-full max-w-xs grow text-xl"
          />
          {isLoading && <LoadingSpinner />}
        </div>
        <ul ref={parent} className="[&>li]:py-1">
          {entries.map((entry, i) => (
            <TemplateRow
              key={i}
              name={entry.entry}
              open={i === selectedRow}
              setOpen={() => setSelectedRow(i)}
              onMoveUp={() => {
                setEntries(
                  (entries) =>
                    arrayMoveImmutable(
                      entries,
                      i,
                      i - 1
                    ) as TemplateSchemaEntryType[]
                );
                if (i - 1 >= 0) setSelectedRow(i - 1);
              }}
              onMoveDown={() => {
                setEntries(
                  (entries) =>
                    arrayMoveImmutable(
                      entries,
                      i,
                      i + 1
                    ) as TemplateSchemaEntryType[]
                );
                if (i + 1 <= entries.length - 1) setSelectedRow(i + 1);
              }}
              onDelete={() => {
                setEntries((entries) => {
                  entries.splice(i, 1);
                  return [...entries];
                });
                setSelectedRow(undefined);
              }}
            />
          ))}
        </ul>
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
                { entry: entryRef.current?.value ?? "" },
              ]);
            }
          }}
        >
          +
        </button>
      </div>
      <button
        disabled={
          !TemplateFormSchema.safeParse({
            name: nameRef.current?.value ?? "",
            entries: entries,
          }).success
        }
        className="btn w-full bg-base-100"
        onClick={() => {
          if (nameRef.current?.value) {
            mutate({
              name: nameRef.current.value,
              entries: entries,
            });
          }
        }}
      >
        Confirm
      </button>
    </div>
  );
}
interface TemplateRowProps {
  name: string;
  open: boolean;
  setOpen: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}
const TemplateRow = ({
  name,
  open,
  setOpen,
  onDelete,
  onMoveUp,
  onMoveDown,
}: TemplateRowProps) => {
  return (
    <li className="flex items-center gap-2">
      <button className="btn grow bg-base-100" onClick={setOpen}>
        {name}
      </button>

      <Transition
        show={open}
        enter=" transition-transform duration-75"
        enterFrom="w-0 hidden"
        enterTo="w-auto block"
        leave="transition-transform duration-150"
        leaveFrom="w-auto block"
        leaveTo="w-0 hidden"
      >
        <div className="h-100 rounded-box relative flex gap-2 p-2">
          <span className="hover:cursor-pointer" onClick={onDelete}>
            <DeleteSVG />
          </span>
          <span className="hover:cursor-pointer" onClick={onMoveUp}>
            <ArrowUpSVG />
          </span>
          <span className="hover:cursor-pointer" onClick={onMoveDown}>
            <ArrowDownSVG />
          </span>
        </div>
      </Transition>
    </li>
  );
};
