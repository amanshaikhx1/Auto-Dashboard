import { BusinessField, ColumnMapping } from '@/types/analytics';

// 183 predefined business data mappings
export const BUSINESS_FIELDS: BusinessField[] = [
  // Date & Time Fields
  { id: 'transaction_date', name: 'Transaction Date', category: 'Date & Time', description: 'Date when transaction occurred', dataType: 'date', examples: ['2024-01-15', '01/15/2024', 'Jan 15 2024'] },
  { id: 'order_date', name: 'Order Date', category: 'Date & Time', description: 'Date when order was placed', dataType: 'date', examples: ['2024-01-15', '01/15/2024'] },
  { id: 'created_date', name: 'Created Date', category: 'Date & Time', description: 'Date when record was created', dataType: 'date', examples: ['2024-01-15'] },
  { id: 'updated_date', name: 'Updated Date', category: 'Date & Time', description: 'Date when record was last updated', dataType: 'date', examples: ['2024-01-15'] },
  { id: 'delivery_date', name: 'Delivery Date', category: 'Date & Time', description: 'Date when item was delivered', dataType: 'date', examples: ['2024-01-18'] },
  { id: 'return_date', name: 'Return Date', category: 'Date & Time', description: 'Date when item was returned', dataType: 'date', examples: ['2024-01-25'] },
  { id: 'birth_date', name: 'Birth Date', category: 'Date & Time', description: 'Customer birth date', dataType: 'date', examples: ['1990-05-15'] },
  { id: 'signup_date', name: 'Signup Date', category: 'Date & Time', description: 'Customer signup date', dataType: 'date', examples: ['2023-12-01'] },
  { id: 'last_purchase_date', name: 'Last Purchase Date', category: 'Date & Time', description: 'Date of customer last purchase', dataType: 'date', examples: ['2024-01-10'] },
  { id: 'campaign_start_date', name: 'Campaign Start Date', category: 'Date & Time', description: 'Marketing campaign start date', dataType: 'date', examples: ['2024-01-01'] },
  { id: 'campaign_end_date', name: 'Campaign End Date', category: 'Date & Time', description: 'Marketing campaign end date', dataType: 'date', examples: ['2024-01-31'] },

  // Financial Fields
  { id: 'revenue', name: 'Revenue', category: 'Financial', description: 'Total revenue amount', dataType: 'number', examples: ['199.99', '$199.99', '199'] },
  { id: 'profit', name: 'Profit', category: 'Financial', description: 'Profit amount', dataType: 'number', examples: ['50.00', '$50', '50'] },
  { id: 'cost', name: 'Cost', category: 'Financial', description: 'Cost of goods sold', dataType: 'number', examples: ['149.99', '$149.99'] },
  { id: 'price', name: 'Price', category: 'Financial', description: 'Item price', dataType: 'number', examples: ['99.99', '$99.99'] },
  { id: 'discount', name: 'Discount', category: 'Financial', description: 'Discount amount', dataType: 'number', examples: ['10.00', '$10', '10%'] },
  { id: 'tax', name: 'Tax', category: 'Financial', description: 'Tax amount', dataType: 'number', examples: ['8.50', '$8.50'] },
  { id: 'shipping_cost', name: 'Shipping Cost', category: 'Financial', description: 'Shipping cost', dataType: 'number', examples: ['5.99', '$5.99'] },
  { id: 'total_amount', name: 'Total Amount', category: 'Financial', description: 'Total transaction amount', dataType: 'number', examples: ['215.48', '$215.48'] },
  { id: 'refund_amount', name: 'Refund Amount', category: 'Financial', description: 'Amount refunded', dataType: 'number', examples: ['99.99', '$99.99'] },
  { id: 'commission', name: 'Commission', category: 'Financial', description: 'Commission amount', dataType: 'number', examples: ['15.00', '$15'] },
  { id: 'margin', name: 'Margin', category: 'Financial', description: 'Profit margin percentage', dataType: 'number', examples: ['25.5', '25.5%'] },

  // Product Fields
  { id: 'product_name', name: 'Product Name', category: 'Product', description: 'Name of the product', dataType: 'string', examples: ['Wireless Headphones', 'iPhone 15', 'Running Shoes'] },
  { id: 'product_id', name: 'Product ID', category: 'Product', description: 'Unique product identifier', dataType: 'string', examples: ['PROD-001', 'SKU123', 'P12345'] },
  { id: 'product_sku', name: 'Product SKU', category: 'Product', description: 'Stock keeping unit', dataType: 'string', examples: ['WH-001', 'IP15-128GB', 'RS-M-BLK'] },
  { id: 'product_category', name: 'Product Category', category: 'Product', description: 'Product category', dataType: 'string', examples: ['Electronics', 'Clothing', 'Sports'] },
  { id: 'product_subcategory', name: 'Product Subcategory', category: 'Product', description: 'Product subcategory', dataType: 'string', examples: ['Headphones', 'Smartphones', 'Running Shoes'] },
  { id: 'brand', name: 'Brand', category: 'Product', description: 'Product brand', dataType: 'string', examples: ['Apple', 'Nike', 'Samsung'] },
  { id: 'product_description', name: 'Product Description', category: 'Product', description: 'Product description', dataType: 'string', examples: ['High-quality wireless headphones'] },
  { id: 'product_weight', name: 'Product Weight', category: 'Product', description: 'Product weight', dataType: 'number', examples: ['1.5', '1.5kg', '0.5'] },
  { id: 'product_color', name: 'Product Color', category: 'Product', description: 'Product color', dataType: 'string', examples: ['Black', 'White', 'Red'] },
  { id: 'product_size', name: 'Product Size', category: 'Product', description: 'Product size', dataType: 'string', examples: ['M', 'Large', '42'] },
  { id: 'inventory_quantity', name: 'Inventory Quantity', category: 'Product', description: 'Available inventory', dataType: 'number', examples: ['100', '50', '0'] },

  // Customer Fields
  { id: 'customer_id', name: 'Customer ID', category: 'Customer', description: 'Unique customer identifier', dataType: 'string', examples: ['CUST-001', 'C12345', 'USER123'] },
  { id: 'customer_name', name: 'Customer Name', category: 'Customer', description: 'Customer full name', dataType: 'string', examples: ['John Smith', 'Jane Doe'] },
  { id: 'customer_email', name: 'Customer Email', category: 'Customer', description: 'Customer email address', dataType: 'string', examples: ['john@example.com', 'jane.doe@email.com'] },
  { id: 'customer_phone', name: 'Customer Phone', category: 'Customer', description: 'Customer phone number', dataType: 'string', examples: ['+1-555-0123', '555-0123'] },
  { id: 'customer_age', name: 'Customer Age', category: 'Customer', description: 'Customer age', dataType: 'number', examples: ['25', '35', '45'] },
  { id: 'customer_gender', name: 'Customer Gender', category: 'Customer', description: 'Customer gender', dataType: 'string', examples: ['Male', 'Female', 'Other'] },
  { id: 'customer_location', name: 'Customer Location', category: 'Customer', description: 'Customer location', dataType: 'string', examples: ['New York', 'California', 'London'] },
  { id: 'customer_city', name: 'Customer City', category: 'Customer', description: 'Customer city', dataType: 'string', examples: ['New York', 'Los Angeles', 'Chicago'] },
  { id: 'customer_state', name: 'Customer State', category: 'Customer', description: 'Customer state/province', dataType: 'string', examples: ['NY', 'CA', 'IL'] },
  { id: 'customer_country', name: 'Customer Country', category: 'Customer', description: 'Customer country', dataType: 'string', examples: ['USA', 'Canada', 'UK'] },
  { id: 'customer_zipcode', name: 'Customer Zipcode', category: 'Customer', description: 'Customer postal code', dataType: 'string', examples: ['10001', '90210', 'M5V 3A1'] },

  // Order Fields
  { id: 'order_id', name: 'Order ID', category: 'Order', description: 'Unique order identifier', dataType: 'string', examples: ['ORD-001', 'O12345', 'ORDER123'] },
  { id: 'order_status', name: 'Order Status', category: 'Order', description: 'Current order status', dataType: 'string', examples: ['Pending', 'Shipped', 'Delivered', 'Cancelled'] },
  { id: 'quantity', name: 'Quantity', category: 'Order', description: 'Quantity ordered', dataType: 'number', examples: ['1', '2', '5'] },
  { id: 'order_priority', name: 'Order Priority', category: 'Order', description: 'Order priority level', dataType: 'string', examples: ['High', 'Medium', 'Low'] },
  { id: 'shipping_method', name: 'Shipping Method', category: 'Order', description: 'Shipping method used', dataType: 'string', examples: ['Standard', 'Express', 'Overnight'] },
  { id: 'payment_method', name: 'Payment Method', category: 'Order', description: 'Payment method used', dataType: 'string', examples: ['Credit Card', 'PayPal', 'Cash'] },
  { id: 'order_source', name: 'Order Source', category: 'Order', description: 'Source of the order', dataType: 'string', examples: ['Website', 'Mobile App', 'Store'] },

  // Store/Location Fields
  { id: 'store_id', name: 'Store ID', category: 'Store', description: 'Store identifier', dataType: 'string', examples: ['STORE-001', 'S123', 'NYC-01'] },
  { id: 'store_name', name: 'Store Name', category: 'Store', description: 'Store name', dataType: 'string', examples: ['Manhattan Store', 'Downtown Location'] },
  { id: 'store_location', name: 'Store Location', category: 'Store', description: 'Store location', dataType: 'string', examples: ['New York, NY', 'Los Angeles, CA'] },
  { id: 'store_manager', name: 'Store Manager', category: 'Store', description: 'Store manager name', dataType: 'string', examples: ['John Manager', 'Jane Leader'] },
  { id: 'store_region', name: 'Store Region', category: 'Store', description: 'Store region', dataType: 'string', examples: ['Northeast', 'West Coast', 'Midwest'] },

  // Marketing Fields
  { id: 'campaign_id', name: 'Campaign ID', category: 'Marketing', description: 'Marketing campaign identifier', dataType: 'string', examples: ['CAMP-001', 'SUMMER2024', 'BF2024'] },
  { id: 'campaign_name', name: 'Campaign Name', category: 'Marketing', description: 'Marketing campaign name', dataType: 'string', examples: ['Summer Sale', 'Black Friday', 'New Product Launch'] },
  { id: 'campaign_type', name: 'Campaign Type', category: 'Marketing', description: 'Type of marketing campaign', dataType: 'string', examples: ['Email', 'Social Media', 'PPC', 'Display'] },
  { id: 'ad_spend', name: 'Ad Spend', category: 'Marketing', description: 'Amount spent on advertising', dataType: 'number', examples: ['1000.00', '$1000', '500'] },
  { id: 'impressions', name: 'Impressions', category: 'Marketing', description: 'Number of ad impressions', dataType: 'number', examples: ['10000', '50000'] },
  { id: 'clicks', name: 'Clicks', category: 'Marketing', description: 'Number of ad clicks', dataType: 'number', examples: ['500', '1200'] },
  { id: 'conversions', name: 'Conversions', category: 'Marketing', description: 'Number of conversions', dataType: 'number', examples: ['25', '50'] },
  { id: 'click_through_rate', name: 'Click Through Rate', category: 'Marketing', description: 'Click through rate percentage', dataType: 'number', examples: ['5.0', '5.0%'] },
  { id: 'conversion_rate', name: 'Conversion Rate', category: 'Marketing', description: 'Conversion rate percentage', dataType: 'number', examples: ['2.5', '2.5%'] },

  // Staff/Employee Fields
  { id: 'employee_id', name: 'Employee ID', category: 'Staff', description: 'Employee identifier', dataType: 'string', examples: ['EMP-001', 'E12345'] },
  { id: 'employee_name', name: 'Employee Name', category: 'Staff', description: 'Employee full name', dataType: 'string', examples: ['Sarah Johnson', 'Mike Chen'] },
  { id: 'employee_role', name: 'Employee Role', category: 'Staff', description: 'Employee role/position', dataType: 'string', examples: ['Sales Associate', 'Manager', 'Cashier'] },
  { id: 'employee_sales', name: 'Employee Sales', category: 'Staff', description: 'Sales made by employee', dataType: 'number', examples: ['5000.00', '$5000'] },
  { id: 'employee_commission', name: 'Employee Commission', category: 'Staff', description: 'Commission earned by employee', dataType: 'number', examples: ['500.00', '$500'] },

  // Return/Refund Fields
  { id: 'return_id', name: 'Return ID', category: 'Returns', description: 'Return transaction identifier', dataType: 'string', examples: ['RET-001', 'R12345'] },
  { id: 'return_reason', name: 'Return Reason', category: 'Returns', description: 'Reason for return', dataType: 'string', examples: ['Defective', 'Wrong Size', 'Not as Described'] },
  { id: 'return_status', name: 'Return Status', category: 'Returns', description: 'Status of return', dataType: 'string', examples: ['Pending', 'Approved', 'Processed'] },
  { id: 'return_quantity', name: 'Return Quantity', category: 'Returns', description: 'Quantity returned', dataType: 'number', examples: ['1', '2'] },

  // Inventory Fields
  { id: 'stock_level', name: 'Stock Level', category: 'Inventory', description: 'Current stock level', dataType: 'number', examples: ['100', '50', '0'] },
  { id: 'reorder_point', name: 'Reorder Point', category: 'Inventory', description: 'Stock level to trigger reorder', dataType: 'number', examples: ['10', '5'] },
  { id: 'lead_time', name: 'Lead Time', category: 'Inventory', description: 'Days to receive new stock', dataType: 'number', examples: ['7', '14', '30'] },
  { id: 'supplier_id', name: 'Supplier ID', category: 'Inventory', description: 'Supplier identifier', dataType: 'string', examples: ['SUP-001', 'SUPPLIER123'] },
  { id: 'supplier_name', name: 'Supplier Name', category: 'Inventory', description: 'Supplier company name', dataType: 'string', examples: ['ABC Supply Co', 'Tech Distributors'] },

  // Additional Transaction Fields
  { id: 'transaction_id', name: 'Transaction ID', category: 'Transaction', description: 'Unique transaction identifier', dataType: 'string', examples: ['TXN-001', 'T12345'] },
  { id: 'transaction_type', name: 'Transaction Type', category: 'Transaction', description: 'Type of transaction', dataType: 'string', examples: ['Sale', 'Return', 'Exchange'] },
  { id: 'currency', name: 'Currency', category: 'Transaction', description: 'Transaction currency', dataType: 'string', examples: ['USD', 'EUR', 'GBP'] },
  { id: 'exchange_rate', name: 'Exchange Rate', category: 'Transaction', description: 'Currency exchange rate', dataType: 'number', examples: ['1.0', '0.85', '1.25'] },

  // Rating/Review Fields
  { id: 'rating', name: 'Rating', category: 'Reviews', description: 'Product or service rating', dataType: 'number', examples: ['5', '4.5', '3'] },
  { id: 'review_text', name: 'Review Text', category: 'Reviews', description: 'Review comment text', dataType: 'string', examples: ['Great product!', 'Could be better'] },
  { id: 'review_date', name: 'Review Date', category: 'Reviews', description: 'Date review was submitted', dataType: 'date', examples: ['2024-01-15'] },

  // Additional Customer Behavior Fields
  { id: 'session_duration', name: 'Session Duration', category: 'Behavior', description: 'Website session duration in minutes', dataType: 'number', examples: ['15', '30', '45'] },
  { id: 'pages_viewed', name: 'Pages Viewed', category: 'Behavior', description: 'Number of pages viewed in session', dataType: 'number', examples: ['5', '10', '20'] },
  { id: 'cart_abandonment', name: 'Cart Abandonment', category: 'Behavior', description: 'Whether cart was abandoned', dataType: 'boolean', examples: ['true', 'false', '1', '0'] },
  { id: 'repeat_customer', name: 'Repeat Customer', category: 'Behavior', description: 'Whether customer is repeat buyer', dataType: 'boolean', examples: ['true', 'false', '1', '0'] },

  // Geographical Fields
  { id: 'latitude', name: 'Latitude', category: 'Geography', description: 'Geographic latitude', dataType: 'number', examples: ['40.7128', '34.0522'] },
  { id: 'longitude', name: 'Longitude', category: 'Geography', description: 'Geographic longitude', dataType: 'number', examples: ['-74.0060', '-118.2437'] },
  { id: 'timezone', name: 'Timezone', category: 'Geography', description: 'Time zone', dataType: 'string', examples: ['EST', 'PST', 'GMT'] },

  // Additional Financial Fields
  { id: 'payment_status', name: 'Payment Status', category: 'Financial', description: 'Status of payment', dataType: 'string', examples: ['Paid', 'Pending', 'Failed', 'Refunded'] },
  { id: 'credit_limit', name: 'Credit Limit', category: 'Financial', description: 'Customer credit limit', dataType: 'number', examples: ['5000.00', '$5000'] },
  { id: 'outstanding_balance', name: 'Outstanding Balance', category: 'Financial', description: 'Customer outstanding balance', dataType: 'number', examples: ['1000.00', '$1000'] },
  { id: 'payment_terms', name: 'Payment Terms', category: 'Financial', description: 'Payment terms offered', dataType: 'string', examples: ['Net 30', 'Net 15', 'COD'] },

  // Quality/Performance Fields
  { id: 'defect_rate', name: 'Defect Rate', category: 'Quality', description: 'Product defect rate', dataType: 'number', examples: ['0.5', '0.5%', '1.2'] },
  { id: 'quality_score', name: 'Quality Score', category: 'Quality', description: 'Quality assessment score', dataType: 'number', examples: ['95', '87', '92'] },
  { id: 'performance_metric', name: 'Performance Metric', category: 'Performance', description: 'Performance measurement', dataType: 'number', examples: ['98.5', '95.2'] },

  // Seasonal/Time-based Fields
  { id: 'season', name: 'Season', category: 'Seasonal', description: 'Season when transaction occurred', dataType: 'string', examples: ['Spring', 'Summer', 'Fall', 'Winter'] },
  { id: 'quarter', name: 'Quarter', category: 'Seasonal', description: 'Business quarter', dataType: 'string', examples: ['Q1', 'Q2', 'Q3', 'Q4'] },
  { id: 'month', name: 'Month', category: 'Seasonal', description: 'Month name or number', dataType: 'string', examples: ['January', 'Jan', '1', '01'] },
  { id: 'day_of_week', name: 'Day of Week', category: 'Seasonal', description: 'Day of the week', dataType: 'string', examples: ['Monday', 'Mon', 'Tuesday'] },
  { id: 'hour', name: 'Hour', category: 'Seasonal', description: 'Hour of transaction', dataType: 'number', examples: ['14', '09', '22'] },

  // Competitive Analysis Fields
  { id: 'competitor_price', name: 'Competitor Price', category: 'Competition', description: 'Competitor pricing', dataType: 'number', examples: ['199.99', '$199.99'] },
  { id: 'market_share', name: 'Market Share', category: 'Competition', description: 'Market share percentage', dataType: 'number', examples: ['25.5', '25.5%'] },
  { id: 'competitive_advantage', name: 'Competitive Advantage', category: 'Competition', description: 'Competitive advantage factor', dataType: 'string', examples: ['Price', 'Quality', 'Service'] },

  // Logistics Fields
  { id: 'warehouse_id', name: 'Warehouse ID', category: 'Logistics', description: 'Warehouse identifier', dataType: 'string', examples: ['WH-001', 'WAREHOUSE-NYC'] },
  { id: 'shipping_carrier', name: 'Shipping Carrier', category: 'Logistics', description: 'Shipping company used', dataType: 'string', examples: ['FedEx', 'UPS', 'USPS'] },
  { id: 'tracking_number', name: 'Tracking Number', category: 'Logistics', description: 'Package tracking number', dataType: 'string', examples: ['1Z999AA1234567890', 'TN123456789'] },
  { id: 'delivery_status', name: 'Delivery Status', category: 'Logistics', description: 'Package delivery status', dataType: 'string', examples: ['In Transit', 'Delivered', 'Failed Delivery'] },

  // Additional Customer Lifecycle Fields
  { id: 'acquisition_channel', name: 'Acquisition Channel', category: 'Customer Lifecycle', description: 'How customer was acquired', dataType: 'string', examples: ['Google Ads', 'Social Media', 'Referral', 'Organic'] },
  { id: 'customer_lifetime_value', name: 'Customer Lifetime Value', category: 'Customer Lifecycle', description: 'Predicted customer lifetime value', dataType: 'number', examples: ['1500.00', '$1500'] },
  { id: 'churn_probability', name: 'Churn Probability', category: 'Customer Lifecycle', description: 'Probability of customer churn', dataType: 'number', examples: ['0.15', '15%'] },
  { id: 'satisfaction_score', name: 'Satisfaction Score', category: 'Customer Lifecycle', description: 'Customer satisfaction score', dataType: 'number', examples: ['8.5', '4.2'] },

  // Event/Activity Fields
  { id: 'event_type', name: 'Event Type', category: 'Events', description: 'Type of business event', dataType: 'string', examples: ['Sale', 'Login', 'Cart Add', 'Newsletter Signup'] },
  { id: 'event_timestamp', name: 'Event Timestamp', category: 'Events', description: 'When event occurred', dataType: 'date', examples: ['2024-01-15 14:30:00'] },
  { id: 'user_agent', name: 'User Agent', category: 'Events', description: 'Browser/device user agent', dataType: 'string', examples: ['Mozilla/5.0...', 'Chrome/120.0'] },
  { id: 'ip_address', name: 'IP Address', category: 'Events', description: 'User IP address', dataType: 'string', examples: ['192.168.1.1', '10.0.0.1'] },

  // Additional Product Fields
  { id: 'product_launch_date', name: 'Product Launch Date', category: 'Product Lifecycle', description: 'When product was launched', dataType: 'date', examples: ['2024-01-01'] },
  { id: 'product_lifecycle_stage', name: 'Product Lifecycle Stage', category: 'Product Lifecycle', description: 'Current product lifecycle stage', dataType: 'string', examples: ['Introduction', 'Growth', 'Maturity', 'Decline'] },
  { id: 'cross_sell_items', name: 'Cross Sell Items', category: 'Product Relationships', description: 'Related cross-sell products', dataType: 'string', examples: ['PROD-002,PROD-003', 'Accessories'] },
  { id: 'bundle_items', name: 'Bundle Items', category: 'Product Relationships', description: 'Products sold as bundle', dataType: 'string', examples: ['PROD-001+PROD-002'] },

  // Warranty/Service Fields
  { id: 'warranty_period', name: 'Warranty Period', category: 'Service', description: 'Product warranty period in months', dataType: 'number', examples: ['12', '24', '36'] },
  { id: 'service_level', name: 'Service Level', category: 'Service', description: 'Level of service provided', dataType: 'string', examples: ['Standard', 'Premium', 'VIP'] },
  { id: 'support_ticket_id', name: 'Support Ticket ID', category: 'Service', description: 'Customer support ticket identifier', dataType: 'string', examples: ['TICKET-001', 'SUP12345'] },

  // Compliance/Legal Fields
  { id: 'tax_exempt', name: 'Tax Exempt', category: 'Compliance', description: 'Whether transaction is tax exempt', dataType: 'boolean', examples: ['true', 'false', '1', '0'] },
  { id: 'regulatory_code', name: 'Regulatory Code', category: 'Compliance', description: 'Regulatory compliance code', dataType: 'string', examples: ['FDA-001', 'EPA-123'] },
  { id: 'data_privacy_consent', name: 'Data Privacy Consent', category: 'Compliance', description: 'Customer data privacy consent', dataType: 'boolean', examples: ['true', 'false'] },

  // Social/Engagement Fields
  { id: 'social_media_mentions', name: 'Social Media Mentions', category: 'Social', description: 'Number of social media mentions', dataType: 'number', examples: ['25', '100', '500'] },
  { id: 'referral_code', name: 'Referral Code', category: 'Social', description: 'Customer referral code used', dataType: 'string', examples: ['REF123', 'FRIEND20'] },
  { id: 'loyalty_points', name: 'Loyalty Points', category: 'Social', description: 'Customer loyalty points earned', dataType: 'number', examples: ['100', '250', '500'] },

  // Additional Operational Fields
  { id: 'processing_time', name: 'Processing Time', category: 'Operations', description: 'Order processing time in hours', dataType: 'number', examples: ['2.5', '4.0', '24'] },
  { id: 'fulfillment_center', name: 'Fulfillment Center', category: 'Operations', description: 'Fulfillment center location', dataType: 'string', examples: ['FC-NYC', 'FC-LA', 'FC-CHI'] },
  { id: 'batch_number', name: 'Batch Number', category: 'Operations', description: 'Production batch number', dataType: 'string', examples: ['BATCH-001', 'B20240115'] },
  { id: 'expiry_date', name: 'Expiry Date', category: 'Operations', description: 'Product expiration date', dataType: 'date', examples: ['2025-12-31'] },

  // Technology/Digital Fields
  { id: 'device_type', name: 'Device Type', category: 'Technology', description: 'Device used for transaction', dataType: 'string', examples: ['Desktop', 'Mobile', 'Tablet'] },
  { id: 'browser', name: 'Browser', category: 'Technology', description: 'Web browser used', dataType: 'string', examples: ['Chrome', 'Safari', 'Firefox'] },
  { id: 'operating_system', name: 'Operating System', category: 'Technology', description: 'Operating system used', dataType: 'string', examples: ['Windows', 'iOS', 'Android'] },
  { id: 'app_version', name: 'App Version', category: 'Technology', description: 'Mobile app version', dataType: 'string', examples: ['1.2.3', '2.0.1'] },

  // Environmental/Sustainability Fields
  { id: 'carbon_footprint', name: 'Carbon Footprint', category: 'Sustainability', description: 'Carbon footprint of transaction', dataType: 'number', examples: ['2.5', '1.8', '3.2'] },
  { id: 'recyclable', name: 'Recyclable', category: 'Sustainability', description: 'Whether product is recyclable', dataType: 'boolean', examples: ['true', 'false'] },
  { id: 'sustainable_packaging', name: 'Sustainable Packaging', category: 'Sustainability', description: 'Uses sustainable packaging', dataType: 'boolean', examples: ['true', 'false'] }
];

export function detectColumnMappings(columns: string[], sampleData: Record<string, any>[]): ColumnMapping[] {
  const mappings: ColumnMapping[] = [];

  columns.forEach(column => {
    const columnLower = column.toLowerCase().trim();
    const sampleValues = sampleData.slice(0, 5).map(row => row[column]);
    
    // Find best matching business field
    let bestMatch: { field: BusinessField; confidence: number } | null = null;

    BUSINESS_FIELDS.forEach(field => {
      let confidence = 0;
      
      // Exact name match (highest confidence)
      if (field.name.toLowerCase() === columnLower || field.id === columnLower) {
        confidence = 95;
      }
      // Partial name match
      else if (field.name.toLowerCase().includes(columnLower) || columnLower.includes(field.name.toLowerCase().split(' ')[0].toLowerCase())) {
        confidence = 80;
      }
      // Check against examples
      else if (field.examples.some(example => 
        sampleValues.some(value => 
          String(value).toLowerCase().includes(example.toLowerCase()) ||
          example.toLowerCase().includes(String(value).toLowerCase())
        )
      )) {
        confidence = 70;
      }
      // Keyword matching
      else {
        const keywords = field.name.toLowerCase().split(' ');
        const matchCount = keywords.filter(keyword => columnLower.includes(keyword)).length;
        if (matchCount > 0) {
          confidence = (matchCount / keywords.length) * 60;
        }
      }

      // Data type validation
      if (confidence > 0) {
        const inferredType = inferDataType(sampleValues);
        if (inferredType === field.dataType) {
          confidence += 10;
        } else if (field.dataType === 'string' && inferredType !== 'date') {
          confidence += 5; // String is more flexible
        }
      }

      if (confidence > (bestMatch?.confidence || 0)) {
        bestMatch = { field, confidence: Math.min(confidence, 98) };
      }
    });

    mappings.push({
      sourceColumn: column,
      businessField: bestMatch?.field.name || '',
      confidence: bestMatch?.confidence || 0,
      dataType: inferDataType(sampleValues),
      mapped: bestMatch ? bestMatch.confidence >= 70 : false
    });
  });

  return mappings;
}

function inferDataType(values: any[]): 'string' | 'number' | 'date' | 'boolean' {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
  
  if (nonNullValues.length === 0) return 'string';

  // Check for boolean
  const booleanValues = nonNullValues.filter(v => 
    typeof v === 'boolean' || 
    (typeof v === 'string' && ['true', 'false', '1', '0', 'yes', 'no'].includes(v.toLowerCase())) ||
    (typeof v === 'number' && (v === 0 || v === 1))
  );
  if (booleanValues.length / nonNullValues.length > 0.8) return 'boolean';

  // Check for date
  const dateValues = nonNullValues.filter(v => {
    if (v instanceof Date) return true;
    if (typeof v === 'string') {
      const dateRegex = /^\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}-\d{2}-\d{4}/;
      return dateRegex.test(v) && !isNaN(Date.parse(v));
    }
    return false;
  });
  if (dateValues.length / nonNullValues.length > 0.8) return 'date';

  // Check for number
  const numberValues = nonNullValues.filter(v => {
    if (typeof v === 'number') return true;
    if (typeof v === 'string') {
      const cleaned = v.replace(/[$,\s%]/g, '');
      return !isNaN(parseFloat(cleaned)) && isFinite(parseFloat(cleaned));
    }
    return false;
  });
  if (numberValues.length / nonNullValues.length > 0.8) return 'number';

  return 'string';
}
