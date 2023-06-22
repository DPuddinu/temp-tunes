import { Disclosure, Transition } from "@headlessui/react";
import { type Table } from "@tanstack/react-table";
import { useState } from "react";

export function FiltersComponent<TData>({ table }: { table: Table<TData> }) {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div
      key="filters"
      className="mb-4 w-full gap-2 rounded-lg bg-base-200 text-lg font-medium tracking-wide lg:w-3/4"
    >
      <Disclosure>
        <Disclosure.Button>
          <div onClick={() => setFilterOpen((open) => !open)} className="p-4">
            {`Filters ${filterOpen ? "-" : "+"}`}
          </div>
        </Disclosure.Button>

        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Disclosure.Panel>
            <div className="flex flex-wrap gap-2 rounded-b-lg bg-base-200 p-4 md:flex-nowrap">
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  value={
                    (table.getColumn("name")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                  type="text"
                  placeholder=""
                  className="input-bordered input w-full max-w-xs"
                />
              </div>
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Creator</span>
                </label>
                <input
                  value={
                    (table.getColumn("creator")?.getFilterValue() as string) ??
                    ""
                  }
                  onChange={(event) => {
                    table
                      .getColumn("creator")
                      ?.setFilterValue(event.target.value);
                  }}
                  type="text"
                  placeholder=""
                  className="input-bordered input w-full max-w-xs"
                />
              </div>
            </div>
          </Disclosure.Panel>
        </Transition>
      </Disclosure>
    </div>
  );
}
