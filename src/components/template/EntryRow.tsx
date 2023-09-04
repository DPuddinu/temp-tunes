import {
  LazyMotion,
  Reorder,
  domAnimation,
  m,
  useDragControls
} from "framer-motion";
import type { UseFormRegister } from "react-hook-form";
import { DeleteSVG } from "../ui/icons";
import { ReorderIcon } from "../ui/icons/ReorderSVG";
import type { TemplateFormType } from "./CreateTemplate";

const variants = {
  visible: { opacity: 1, scale: 1 },
  hidden: { opacity: 0, scale: 0 },
};

interface EntryRow {
  name: string;
  open: boolean;
  register: UseFormRegister<TemplateFormType>;
  id: string;
  index: number;
  setOpen: () => void;
  onDelete: () => void;
}
const EntryRow = ({
  name,
  open,
  setOpen,
  onDelete,
  index,
  id,
  register,
}: EntryRow) => {

  const dragControls = useDragControls();
  
  return (
    <LazyMotion features={domAnimation}>
      <Reorder.Item value={name} key={id} className="flex items-center gap-2">
        <m.input
          className="btn grow bg-base-100 outline-none hover:bg-base-200"
          onClick={setOpen}
          type="text"
          defaultValue={name}
          placeholder={"name"}
          {...register(`entries.${index}.entry`)}
        />

        {open && (
          <m.div
            className="h-100 rounded-box flex transform-gpu gap-2 p-2 items-center justify-center"
            initial={variants.hidden}
            animate={variants.visible}
            exit={variants.hidden}
          >
            <span className="hover:cursor-pointer" onClick={onDelete}>
              <DeleteSVG />
            </span>
            <ReorderIcon dragControls={dragControls} />
          </m.div>
        )}
      </Reorder.Item>
    </LazyMotion>
  );
};

export default EntryRow;
