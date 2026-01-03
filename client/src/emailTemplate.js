export const emailTemplate = (fullName, startDate, endDate) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leave Request Notification</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007bff;
            color: #ffffff;
            padding: 10px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
        }
        .message {
            font-size: 16px;
            line-height: 1.5;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 0 0 8px 8px;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Leave Request Notification</h2>
        </div>
        <div class="content">
            <p class="message">Hi ${fullName}! You have requested leave from ${startDate} to ${endDate}.</p>
        </div>
        <div class="footer">
            <p>&copy; PulseZest</p>
        </div>
    </div>
</body>
</html>
`;