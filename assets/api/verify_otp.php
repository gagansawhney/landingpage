<?php
// Simple server-side verifier for MSG91 OTP access tokens
// Expects POST: access_token
// Reads MSG91 AuthKey from environment variable MSG91_AUTHKEY

header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

$authKey = getenv('MSG91_AUTHKEY');
if (!$authKey) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Server not configured. Set MSG91_AUTHKEY environment variable.']);
    exit;
}

$raw = file_get_contents('php://input');
$data = [];
if ($raw) {
    $data = json_decode($raw, true);
}
if (!$data) {
    // Fallback to form-encoded
    $data = $_POST;
}

$accessToken = isset($data['access_token']) ? $data['access_token'] : '';
if (!$accessToken) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Missing access_token']);
    exit;
}

$url = 'https://control.msg91.com/api/v5/widget/verifyAccessToken';
$payload = [
    'authkey' => $authKey,
    'access-token' => $accessToken
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$resp = curl_exec($ch);
$err = curl_error($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($err) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'Upstream error', 'detail' => $err]);
    exit;
}

$json = json_decode($resp, true);
if ($status >= 200 && $status < 300 && $json) {
    // Heuristically determine success
    $ok = false;
    if (isset($json['type']) && strtolower($json['type']) === 'success') $ok = true;
    if (isset($json['success']) && $json['success'] === true) $ok = true;
    if (isset($json['status']) && strtolower($json['status']) === 'success') $ok = true;

    if ($ok) {
        echo json_encode(['ok' => true]);
        exit;
    }
}

http_response_code(400);
echo json_encode(['ok' => false, 'error' => 'Verification failed', 'response' => $json, 'status' => $status]);
?>


