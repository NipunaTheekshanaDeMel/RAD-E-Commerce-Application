class OrderDTO {
    constructor(id, userId, items, total, status, shippingAddress, createdAt, updatedAt) {
        this.id = id;
        this.userId = userId;
        this.items = items.map(item => ({
            product: item.product,
            quantity: item.quantity
        }));
        this.total = total;
        this.status = status;
        this.shippingAddress = {
            name: shippingAddress.name,
            address: shippingAddress.address,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country
        };
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            items: this.items,
            total: this.total,
            status: this.status,
            shippingAddress: this.shippingAddress,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = OrderDTO;
