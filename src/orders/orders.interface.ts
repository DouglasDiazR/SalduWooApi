interface IOrders {
    id: number
    number: string
    status: string
    total: number
    date_created: string
    date_modified: string
    date_paid: string
    line_items: ILineItem[]
}

interface ILineItem {
    product_id: number
    name: string
    quantity: number
    price: number
    total: number
    meta_data: IMetaData[]
}

interface IMetaData {
    key: string
    value: string
}
export default IOrders
