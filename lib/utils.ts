export const formatDate = (dateStr: string) => {
    const date = new Date (dateStr);
    const formatter = new Intl.DateTimeFormat("id-ID",{
        dateStyle:"medium"
    });
    return formatter.format(date);
}

export const formatCurrency = (amount: number) => {    
    const formatter = new Intl.NumberFormat("id-ID",{
       style:"currency",
       currency: "IDR",
       minimumFractionDigits:0,
       maximumFractionDigits:0
    });
    return formatter.format(amount);
}