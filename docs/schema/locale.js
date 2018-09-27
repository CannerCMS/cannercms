import flatten from 'flat';
export default {
  en: flatten({
    share: {
      logo: 'Logo',
      title: 'Title'
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
      payStatus: 'Payment Status',
      shipStatus: 'Shipment Status',
      orderInfo: {
        layoutTitle: 'Order Info',
        buyerName: 'Buyer Name',
        buyerPhone: 'Buyer Phone',
        buyerEmail: 'Buyer Email',
        receiverName: 'Receiver Name',
        receiverPhone: 'Receiver Phone',
        receiverAddress: 'Receiver Address',
        shipmentWay: 'Shipment Way',
        receiveTime: 'Receive Time',
        card: {
          title: 'Card Info',
          receiverName: 'Receiver Name',
          content: 'Content',
          senderName: 'Sender Name',
          comment: 'Comment'
        },
        detail: {
          title: 'Product List',
          count: 'Count'
        },
        otherInfo: 'Other Info',
        isHighPrice: 'Is High Price',
        discount: 'Discount',
        shipFee: 'Shipment Fee',
        amount: 'Amount'
      },
      
    }
  }),
  zh: flatten({

  })
}