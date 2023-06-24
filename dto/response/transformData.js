export const category = (data) => {

}

export const billingData = (data) => {
    // const { billing_detail: { billing_category: { vehicleType = {} } = {} },...rest } = data;
    const { billing_detail, ...rest } = data;
    const { billing_category } = billing_detail;
    const { dataValues: { vehicleType = null } } = billing_category;

    return {
        ...rest,
        vehicleType: vehicleType
    }
}

export const billDetail = (data) => {
    const { id, billing_id,billing_category_id, quantity, serial_no,billing_amount, created_at, billing_category } = data;
    const { title } = billing_category;
    return {
        id,
        billing_id,
        billing_category_id,
        quantity,
        serial_no,
        rate:billing_amount,
        created_at,
        title
       
    }
}