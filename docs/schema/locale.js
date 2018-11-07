import flatten from 'flat';
export default {
  en: flatten({
    share: {
      logo: 'Logo',
      title: 'Title'
    },
    dashboard: {
      title: 'Dashboard',
      desc: 'Canner is also supporting indicators, charts, and filters to help you build extendable administrator console for your datasets and APIs.',
      visitors: 'Visitors',
      orders: 'Orders',
      customers: 'Total Customers'
    },
    home: {
      title: 'Home Page',
      description: '<a href="https://www.canner.io/docs/schema-layout-tags">&lt;Layout /&gt; tags </a> are used to create grids, containers, and blocks in CMS. And allows you to create customized design layouts and visual design for your CMS.',
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
      description: 'You can implement sort and filter in each column with <a href="https://ant.design/components/table/#Column">antd column configuration</a> and customize your page header with <code>&lt;Body&gt;</code> tag. </br> Click the links below to see the source codes.',
      'prod.description': 'Product Description',
      price: 'Price',
      unit: 'dollars',
      promo: 'Promo Price',
      addPurchase: 'Additional Purchase',
      storage: {
        layoutTitle: 'Storage',
        count: 'Count',
        enabled: 'Enable'
      },
      photos: 'Photos',
      filter: {
        no: {
          label: 'Product Number',
        },
        name: {
          label: 'Name',
        }
      }
    },
    categories: {
      title: 'Categories',
      description: 'Dealing with relationship data is annoying, but in Canner, it\'s just a few tags and properties. </br> See <a href="https://github.com/Canner/canner/blob/canary/docs/schema/categories.schema.js">source schema</a> or <a href="https://www.canner.io/docs/schema-data-type-tags#lt-relation-gt">tags document</a> to learn more.',
      name: 'Category Name',
      parent: 'Parent Category'
    },
    orders: {
      title: 'Orders',
      description: 'Canner provide several features for developers to build a powerful CMS, see <a href="https://www.canner.io/docs/schema-toolbar-tags">&lt;toolbar/> tags </a> and <a href="https://github.com/Canner/canner/blob/canary/docs/schema/orders.schema.js">source schema</a> to know how to do that.',
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
        },
        no: {
          label: 'Search Order No.',
        }
      }
    },
    customers: {
      title: 'Customers',
      description: 'Canner fetches array data without any query by default which means all the filter, sort, pagination are done at the client side. But if you want to do these query at the server side, you can change the fetch policy to <a href="https://www.canner.io/docs/schema-toolbar-tags#fetch-policy">async</a>.',
      name: 'Name',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      consignees: 'Consignees',
      filter: {
        name: {
          label: 'Search Customer Name',
        },
        phone: {
          label: 'Search Customer Phone',
        }
      }
    }
  }),
  zh: flatten({
    share: {
      logo: '商標',
      title: '標題'
    },
    dashboard: {
      title: '總覽',
      desc: 'Canner 也支援讓你自訂頁面以及提供多種圖表使用。',
      visitor: '訪客數',
      orders: '訂單數',
      customers: '顧客數'
    },
    home: {
      title: '首頁設定',
      description: '在這裡設定你的首頁。',
      entry: {
        layoutTitle: '進場頁面',
        title: '網站標題',
        slogan: '網站標語',
        bannerBg: '背景圖'
      },
      header: {
        layoutTitle: '頁首',
      },
      footer: {
        layoutTitle: '頁尾',
        fb: 'Facebook 連結',
        ig: 'Instagram 連結',
        email: 'Email'
      }
    },
    products: {
      title: '商品設定',
      basicSetting: '基本設定',
      no: '商品編號',
      name: '商品名',
      description: '商品描述',
      price: '原價',
      unit: '元',
      promo: '優惠價',
      addPurchase: '加價商品',
      storage: {
        layoutTitle: '庫存設定',
        count: '剩餘個數',
        enabled: '是否啟用'
      },
      photos: '商品圖片',
      filter: {
        no: {
          label: '搜尋商品編號',
        },
        name: {
          label: '搜尋商品名',
        }
      }
    },
    categories: {
      title: '類別設定',
      name: '類別名稱',
      parent: '母類別'
    },
    orders: {
      title: '訂單',
      no: '訂單編號',
      orderStatus: '訂單狀態',
      createDate: '建立日期',
      paymentType: '付款方式',
      payStatus: '付款狀態',
      shipStatus: '運送狀態',
      newOrder: "新訂單",
      oldOrder: "舊訂單",
      notPaid: "尚未付款",
      paid: '已付款',
      'paymentType.credit': '信用卡',
      'unshipped': '未出貨',
      'shipping': '已出貨',
      'delivered': '已送達',
      orderInfo: {
        layoutTitle: '訂單資訊',
        buyerName: '購買人姓名',
        buyerPhone: '購買人電話',
        buyerEmail: '購買人 Email',
        receiverName: '收件人姓名',
        receiverPhone: '收件人電話',
        receiverAddress: '收件人地址',
        shipmentWay: '運送方式',
        'shipmentWay.person': '自取',
        'shipmentWay.home': '宅配',
        receiveTime: '預計送達時間',
        card: {
          title: '卡片資訊',
          receiverName: '收件人姓名',
          content: '卡片內容',
          senderName: '寄件人姓名',
          comment: '備註'
        },
      },
      detail: {
        title: '購買清單',
        count: '數量'
      },
      otherInfo: '其他資訊',
      discount: '折扣',
      shipFee: '運費',
      amount: '結算金額',
      filter: {
        buyerName: {
          label: '搜尋購買人姓名',
        },
        no: {
          label: '搜尋購買人編號',
        }
      }
    },
    customers: {
      title: '顧客',
      name: '姓名',
      phone: '電話',
      email: 'Email',
      address: '住址',
      consignees: '歷史收件紀錄',
      filter: {
        name: {
          label: '搜尋顧客姓名',
        },
        phone: {
          label: '搜尋顧客電話',
        }
      }
    }
  })
}