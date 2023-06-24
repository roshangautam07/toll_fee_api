export const category = (data) => {
    
}

export const billingData = (data)=>{
    // const { billing_detail: { billing_category: { vehicleType = {} } = {} },...rest } = data;
    const { billing_detail,...rest } = data;
    const { billing_category } = billing_detail;
    const { dataValues: { vehicleType = null } } = billing_category;

    return {
        ...rest,
        vehicleType:vehicleType
    }
}