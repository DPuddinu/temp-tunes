import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { type SubmitHandler, type UseFormRegister, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "~/hooks/use-toast";
import { TemplateEntrySchema } from "~/types/zod-schemas";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Transition } from "@headlessui/react";
import { DeleteSVG, ArrowUpSVG, ArrowDownSVG } from "../ui/icons";

const TemplateFormSchema = z.object({
  name: z.string().min(3).max(16),
  entries: TemplateEntrySchema.array().min(1),
});
type TemplateFormType = z.infer<typeof TemplateFormSchema>;

function CreateTemplate() {
  const { setMessage } = useToast();

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
    control,
    formState: { isValid },
  } = useForm<TemplateFormType>({ resolver: zodResolver(TemplateFormSchema) });

  const { fields, append, remove, move } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "entries", // unique name for your Field Array
  });

  const onSubmit: SubmitHandler<TemplateFormType> = (data) =>
    mutate({
      name: data.name,
      entries: data.entries,
    });

  return (
    <form
      className="min-h-60 flex max-w-sm flex-col justify-between gap-2 rounded-xl bg-base-300 p-2 shadow"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex w-full flex-col gap-2" ref={parent}>
        <div className="flex justify-between gap-2 bg-base-300">
          <input
            type="text"
            placeholder="Template Name"
            className="input-ghost input w-full max-w-xs grow  text-xl "
            {...register("name")}
          />
          {isLoading && <LoadingSpinner />}
        </div>
        <ul ref={parent} className="[&>li]:py-1">
          {fields.map((entry, i) => (
            <TemplateRow
              register={register}
              id={entry.id}
              index={i}
              key={i}
              name={entry.entry}
              open={i === selectedRow}
              setOpen={() =>
                setSelectedRow((row) => (row === i ? undefined : i))
              }
              onMoveUp={() => {
                if (i - 1 >= 0) {
                  move(i, i - 1);
                  setSelectedRow(i - 1);
                }
              }}
              onMoveDown={() => {
                if (i + 1 <= fields.length - 1) {
                  move(i, i + 1);
                  setSelectedRow(i + 1);
                }
              }}
              onDelete={() => {
                remove(i);
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
          type="button"
          className="btn-circle btn bg-base-100 p-2 text-xl hover:bg-base-200"
          onClick={() => {
            if (entryRef.current !== null) {
              append({ entry: entryRef.current.value });
            }
          }}
        >
          +
        </button>
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
  register: UseFormRegister<TemplateFormType>;
  id: string;
  index: number;
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
  index,
  id,
  register,
}: TemplateRowProps) => {
  return (
    <li key={id} className="flex items-center gap-2">
      <input
        className="btn grow bg-base-100 hover:bg-base-200"
        onClick={setOpen}
        type="text"
        defaultValue={name}
        placeholder={"name"}
        {...register(`entries.${index}.entry`)}
      />

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

export default CreateTemplate;