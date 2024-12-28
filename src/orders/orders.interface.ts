interface IOrders {
    id: number
    number: string
    status: string
    total: number
    invoicing: {
        documentType: string
        document: string
        businessName: string
        firstname: string
        lastname: string
        address: string
        phone: string
        email: string
        commission: string
        payBackPrice: string
        shippingPrice: string
    }
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
