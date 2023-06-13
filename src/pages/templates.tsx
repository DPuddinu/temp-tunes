import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
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
type TemplateFormType = z.infer<typeof TemplateFormSchema>;

function CreateTemplate() {
  const { setMessage } = useStore();
  const entryRef = useRef<HTMLInputElement>(null);
  const [parent] = useAutoAnimate();
  const [selectedRow, setSelectedRow] = useState<number | undefined>();

  const { mutate, isLoading } = api.template.createTemplate.useMutation({
    onError() {
      setMessage("Error");
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<TemplateFormType>({ resolver: zodResolver(TemplateFormSchema) });

  const watchedEntries = useWatch({
    control,
    name: "entries",
    defaultValue: [],
  });

  const onSubmit: SubmitHandler<TemplateFormType> = (data) =>
    mutate({
      name: data.name,
      entries: data.entries,
    });

  return (
    <form
      className="min-h-60 flex flex-col justify-between gap-2 rounded-xl bg-base-300 p-2 shadow"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex w-full flex-col gap-2" ref={parent}>
        <div className="flex justify-between gap-2">
          <input
            type="text"
            placeholder="Template Name"
            className="input-ghost input w-full max-w-xs grow text-xl hover:bg-base-200"
            {...register("name")}
          />
          {isLoading && <LoadingSpinner />}
        </div>
        <ul ref={parent} className="[&>li]:py-1">
          {watchedEntries.map((entry, i) => (
            <TemplateRow
              key={i}
              name={entry.entry}
              open={i === selectedRow}
              setOpen={() => setSelectedRow(i)}
              onMoveUp={() => {
                setValue(
                  "entries",
                  // prettier-ignore
                  arrayMoveImmutable(watchedEntries, i, i - 1) as TemplateSchemaEntryType[]
                );
                if (i - 1 >= 0) setSelectedRow(i - 1);
              }}
              onMoveDown={() => {
                setValue(
                  "entries",
                  // prettier-ignore
                  arrayMoveImmutable(watchedEntries, i, i + 1) as TemplateSchemaEntryType[]
                );
                if (i + 1 <= watchedEntries.length - 1) setSelectedRow(i + 1);
              }}
              onDelete={() => {
                watchedEntries.splice(i, 1);
                setValue("entries", watchedEntries);
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
        <div
          className="btn-circle btn bg-base-100 p-2 text-xl hover:bg-base-200"
          onClick={() => {
            if (entryRef.current !== null) {
              // prettier-ignore
              const newEntries = [
                ...(watchedEntries ?? []),
                { entry: entryRef.current.value },
              ];
              setValue("entries", newEntries);
            }
          }}
        >
          +
        </div>
      </div>
      <button
        type="submit"
        disabled={!isValid}
        className="btn w-full bg-base-100 hover:bg-base-200"
      >
        Confirm
      </button>
    </form>
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
      <button
        className="btn grow bg-base-100 hover:bg-base-200"
        onClick={setOpen}
        type="button"
      >
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
