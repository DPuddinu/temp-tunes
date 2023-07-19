import { useAutoAnimate } from "@formkit/auto-animate/react";
import { type PlaylistTemplate, type TemplateEntry } from "@prisma/client";
import TemplateRow from "./TemplateRow";

const TemplateList = ({
  data,
}: {
  data: (PlaylistTemplate & {
    templateEntries: TemplateEntry[];
  })[];
}) => {
  const [parent] = useAutoAnimate();

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" ref={parent}>
      {data.map((template, i) => (
        <TemplateRow
          key={template.id}
          template={template}
          index={i}
        />
      ))}
    </div>
  );
};


export default TemplateList;
