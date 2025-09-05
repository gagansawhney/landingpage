<?php
// Send a WhatsApp message via Twilio
// Requires environment variables:
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_WHATSAPP_FROM (e.g., whatsapp:+14155238886 or whatsapp:+<your_number>)
// Optional:
//   TWILIO_MESSAGING_SERVICE_SID (if you prefer using a Messaging Service)
//   TWILIO_CONTENT_SID (Twilio Content Template SID e.g., HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)

header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

// Load local secrets if present
$__secrets = @include __DIR__ . '/local_secrets.php';
if (!is_array($__secrets)) { $__secrets = []; }

$sid  = isset($__secrets['TWILIO_ACCOUNT_SID']) && $__secrets['TWILIO_ACCOUNT_SID'] !== '' ? $__secrets['TWILIO_ACCOUNT_SID'] : getenv('TWILIO_ACCOUNT_SID');
$token = isset($__secrets['TWILIO_AUTH_TOKEN']) && $__secrets['TWILIO_AUTH_TOKEN'] !== '' ? $__secrets['TWILIO_AUTH_TOKEN'] : getenv('TWILIO_AUTH_TOKEN');
$from = isset($__secrets['TWILIO_WHATSAPP_FROM']) && $__secrets['TWILIO_WHATSAPP_FROM'] !== '' ? $__secrets['TWILIO_WHATSAPP_FROM'] : getenv('TWILIO_WHATSAPP_FROM');
$mss  = isset($__secrets['TWILIO_MESSAGING_SERVICE_SID']) && $__secrets['TWILIO_MESSAGING_SERVICE_SID'] !== '' ? $__secrets['TWILIO_MESSAGING_SERVICE_SID'] : getenv('TWILIO_MESSAGING_SERVICE_SID');
$defaultContentSid = isset($__secrets['TWILIO_CONTENT_SID']) && $__secrets['TWILIO_CONTENT_SID'] !== '' ? $__secrets['TWILIO_CONTENT_SID'] : getenv('TWILIO_CONTENT_SID');

if (!$sid || !$token || (!$from && !$mss)) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'Server not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM or TWILIO_MESSAGING_SERVICE_SID'
    ]);
    exit;
}

$raw = file_get_contents('php://input');
$data = [];
if ($raw) {
    $data = json_decode($raw, true);
}
if (!$data) { $data = $_POST; }

$to = isset($data['to']) ? $data['to'] : '';
$name = isset($data['name']) ? trim($data['name']) : '';
$formLocation = isset($data['form_location']) ? trim($data['form_location']) : '';
$body = isset($data['body']) ? trim($data['body']) : '';
$contentSid = isset($data['content_sid']) ? trim($data['content_sid']) : '';
$contentVars = isset($data['content_variables']) ? $data['content_variables'] : null; // array or JSON string

if (!$to) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Missing to']);
    exit;
}

// Ensure whatsapp: prefix for To/From
if (strpos($to, 'whatsapp:') !== 0) {
    $to = 'whatsapp:' . $to;
}
if ($from && strpos($from, 'whatsapp:') !== 0) {
    $from = 'whatsapp:' . $from;
}

// Prefer Twilio Content template if available (per request or via env)
if ($contentSid === '' && $defaultContentSid) {
    $contentSid = $defaultContentSid;
}
// When no template provided, fall back to plain text body
if ($contentSid === '' && $body === '') {
    // Simple default copy
    $who = $name ? $name : 'there';
    $context = $formLocation ? " (".$formLocation.")" : '';
    $body = "Hi $who, thanks for verifying your number!\nYour enquiry for Coco Verde Villas$context is confirmed. Our team will reach out shortly.";
}

$endpoint = "https://api.twilio.com/2010-04-01/Accounts/" . rawurlencode($sid) . "/Messages.json";

$post = [ 'To' => $to ];
if ($mss) {
    $post['MessagingServiceSid'] = $mss;
} else {
    $post['From'] = $from;
}

if ($contentSid !== '') {
    $post['ContentSid'] = $contentSid;
    if ($contentVars) {
        if (is_array($contentVars)) {
            $post['ContentVariables'] = json_encode($contentVars);
        } else {
            // assume string; use only if valid JSON
            json_decode($contentVars);
            if (json_last_error() === JSON_ERROR_NONE) {
                $post['ContentVariables'] = $contentVars;
            }
        }
    }
} else {
    $post['Body'] = $body;
}

$ch = curl_init($endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));
curl_setopt($ch, CURLOPT_USERPWD, $sid . ':' . $token);

$resp = curl_exec($ch);
$err = curl_error($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($err) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'Twilio error', 'detail' => $err]);
    exit;
}

$json = json_decode($resp, true);
if ($status >= 200 && $status < 300 && isset($json['sid'])) {
    echo json_encode(['ok' => true, 'sid' => $json['sid']]);
    exit;
}

http_response_code($status ?: 400);
echo json_encode(['ok' => false, 'error' => 'Failed to send', 'status' => $status, 'response' => $json ?: $resp]);
?>


