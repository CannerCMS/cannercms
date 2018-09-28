import flatten from 'flat';
export default {
  en: flatten({
    share: {
      logo: 'Logo',
      title: 'Title'
    },
    dashboard: {
      title: 'Dashboard',
      products: 'Total Products',
      orders: 'Total Orders',
      customers: 'Total Customers'
    },
    home: {
      title: 'Home Page',
      description: 'Your home page configuration.',
      entry: {
        layoutTitle: 'Entry Page',
        title: 'Website Title',
        slogan: 'Website Slogan',
        bannerBg: 'Banner Background Image'
      },
      header: {
        layoutTitle: 'Header',
      },
      footer: {
        layoutTitle: 'Footer',
        fb: 'Facebook Link',
        ig: 'Instagram Link',
        email: 'Email'
      }
    },
    products: {
      title: 'Products',
      basicSetting: 'Basic Setting',
      no: 'Product Number',
      name: 'Product Name',
      description: 'Product Description',
      price: 'Price',
      unit: 'dollars',
      promo: 'Promo Price',
      addPurchase: 'Additional Purchase',
      storage: {
        layoutTitle: 'TODO',
        count: 'TODO',
        enabled: 'Enable'
      },
      photos: 'Photos',
      filter: {
        no: {
          label: 'NO',
          placeholder: 'Enter a Product Number'
        },
        name: {
          label: 'Name',
          placeholder: 'Enter a Product Name'
        }
      }
    },
    categories: {
      title: 'Categories',
      name: 'Category Name',
      parent: 'Parent Category'
    },
    orders: {
      title: 'Orders',
      no: 'Order Number',
      orderStatus: 'Order Status',
      createDate: 'Create Date',
      paymentType: 'Payment Type',
      payStatus: 'Payment Status',
      shipStatus: 'Shipment Status',
      newOrder: "New Order",
      oldOrder: "Old Order",
      notPaid: "Not Paid",
      paid: 'Paid',
      'paymentType.credit': 'Credit Card',
      'unshipped': 'Unshipped',
      'shipping': 'Shipping',
      'delivered': 'Delivered',
      orderInfo: {
        layoutTitle: 'Order Info',
        buyerName: 'Buyer Name',
        buyerPhone: 'Buyer Phone',
        buyerEmail: 'Buyer Email',
        receiverName: 'Receiver Name',
        receiverPhone: 'Receiver Phone',
        receiverAddress: 'Receiver Address',
        shipmentWay: 'Shipment Way',
        'shipmentWay.person': 'In Person',
        'shipmentWay.home': 'Home',
        receiveTime: 'Receive Time',
        card: {
          title: 'Card Info',
          receiverName: 'Receiver Name',
          content: 'Content',
          senderName: 'Sender Name',
          comment: 'Comment'
        },
      },
      detail: {
        title: 'Product List',
        count: 'Count'
      },
      otherInfo: 'Other Info',
      isHighPrice: 'Is High Price',
      discount: 'Discount',
      shipFee: 'Shipment Fee',
      amount: 'Amount',
      filter: {
        buyerName: {
          label: 'Search Buyer Name',
          placeholder: 'Enter Buyer Name'
        },
        no: {
          label: 'Search Order No.',
          placeholder: 'Enter Order No.'
        }
      }
    },
    customers: {
      title: 'Customers',
      name: 'Name',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      consignees: 'Consignees',
      filter: {
        name: {
          label: 'Search Customer Name',
          placeholder: 'Enter Customer Name',
        },
        phone: {
          label: 'Search Customer Phone',
          placeholder: 'Enter Customer Phone'
        }
      }
    }
  }),
  zh: flatten({

  })
}