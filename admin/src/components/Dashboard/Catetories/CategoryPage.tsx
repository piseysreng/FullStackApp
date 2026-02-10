import { DataTable } from "../../../../components/ui/data-table";
import { CategoryColumns } from "./TableCategoryColumns";
import { listCategory } from "@/src/actions/categoryAction";
import { CategoryType } from "@/src/db/schema";

export default async function CategoryPage() {
    const categories = await listCategory();

    if (categories.error) {
        return (<div>{categories.message}</div>);
    }
    return (
        <div className="">
            <div className="">
                <DataTable<CategoryType, any> columns={CategoryColumns} data={categories} />
            </div>
        </div>
    )
}