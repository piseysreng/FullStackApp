import { DataTable } from "../../../../components/ui/data-table";
import { listProducts } from "@/src/actions/productAction";
import { ProductColumns } from "./TableProductColumns";
import { ProductWithRelations } from "@/src/types/types";

export default async function ProductsPage() {
    const products = await listProducts();

    if (products.error) {
        return (<div>{products.message}</div>);
    }

    return (
        <div className="">
            <div className="">
                <DataTable<ProductWithRelations, any> columns={ProductColumns} data={products} />
            </div>
        </div>
    )
}