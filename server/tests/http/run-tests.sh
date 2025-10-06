#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3002"
API_URL="$BASE_URL/api"

echo -e "${YELLOW}🚀 Starting API Tests for OursChat${NC}"
echo "Base URL: $BASE_URL"
echo "API URL: $API_URL"
echo "=================================="

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    local expected_status=$5

    echo -e "\n${YELLOW}Testing:${NC} $description"
    echo "Endpoint: $method $endpoint"

    if [ -n "$data" ]; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$endpoint")
    else
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X $method \
            -H "Accept: application/json" \
            "$endpoint")
    fi

    http_code=$(echo $response | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    body=$(echo $response | sed -E 's/HTTPSTATUS:[0-9]*$//')

    if [ "$http_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} - HTTP $http_code"
    else
        echo -e "${RED}❌ FAIL${NC} - Expected $expected_status, got $http_code"
    fi

    # Pretty print JSON if it's valid JSON
    if echo "$body" | jq . >/dev/null 2>&1; then
        echo "Response: $(echo "$body" | jq -c .)"
    else
        echo "Response: $body"
    fi
}

# Test 1: Application Health
echo -e "\n${YELLOW}=== APPLICATION HEALTH ===${NC}"
test_endpoint "GET" "$API_URL/" "Application hello message" "" "200"

# Test 2: Authentication
echo -e "\n${YELLOW}=== AUTHENTICATION ===${NC}"

# Login with valid credentials
login_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"username": "raja", "password": "10062003"}' \
    "$API_URL/auth/login")

if echo "$login_response" | jq . >/dev/null 2>&1; then
    token=$(echo "$login_response" | jq -r '.token // empty')
    if [ -n "$token" ] && [ "$token" != "null" ]; then
        echo -e "${GREEN}✅ Login successful${NC}"
        echo "Token obtained: ${token:0:20}..."
    else
        echo -e "${RED}❌ Login failed - no token received${NC}"
        token=""
    fi
else
    echo -e "${RED}❌ Login failed - invalid response${NC}"
    token=""
fi

# Test login with invalid credentials
test_endpoint "POST" "$API_URL/auth/login" "Login with invalid credentials" \
    '{"username": "invalid", "password": "wrong"}' "401"

# Test 3: Users
echo -e "\n${YELLOW}=== USER MANAGEMENT ===${NC}"
test_endpoint "GET" "$API_URL/users" "Get all users" "" "200"
test_endpoint "GET" "$API_URL/users/1" "Get user by ID" "" "200"
test_endpoint "GET" "$API_URL/users/99999" "Get non-existent user" "" "404"

# Test 4: Profile (requires authentication)
echo -e "\n${YELLOW}=== PROFILE ===${NC}"
if [ -n "$token" ]; then
    profile_response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
        -H "Authorization: Bearer $token" \
        -H "Accept: application/json" \
        "$API_URL/profile/me")

    http_code=$(echo $profile_response | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ Profile access with valid token${NC}"
    else
        echo -e "${RED}❌ Profile access failed with valid token${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping profile tests - no valid token${NC}"
fi

# Test unauthorized profile access
test_endpoint "GET" "$API_URL/profile/me" "Profile without token" "" "401"

# Test 5: Messages
echo -e "\n${YELLOW}=== MESSAGES ===${NC}"

# Send direct message
test_endpoint "POST" "$API_URL/messages/send" "Send direct message" \
    '{"sender_id": 13, "receiver_id": 1, "content": "Test message from automated test"}' "201"

# Send message with invalid sender
test_endpoint "POST" "$API_URL/messages/send" "Send message with invalid sender" \
    '{"sender_id": 999, "receiver_id": 1, "content": "Should fail"}' "201"

# Send message with empty content
test_endpoint "POST" "$API_URL/messages/send" "Send message with empty content" \
    '{"sender_id": 13, "receiver_id": 1, "content": ""}' "400"

# Get all messages
test_endpoint "GET" "$API_URL/messages" "Get all messages" "" "200"

# Get messages by user
test_endpoint "GET" "$API_URL/messages/user/1" "Get messages by user ID" "" "200"

# Test 6: Chat Participants
echo -e "\n${YELLOW}=== CHAT PARTICIPANTS ===${NC}"

# Add participant with invalid chat
test_endpoint "POST" "$API_URL/chat/participants" "Add participant to invalid chat" \
    '{"chat_id": 999999, "user_id": 8}' "200"

# Add participant with invalid user
test_endpoint "POST" "$API_URL/chat/participants" "Add participant - invalid user" \
    '{"chat_id": 111, "user_id": 999}' "200"

# Summary
echo -e "\n${YELLOW}=== TEST SUMMARY ===${NC}"
echo -e "${GREEN}✅ Tests completed!${NC}"
echo -e "Check the output above for detailed results."
echo -e "\nFor interactive testing, use the .http files in VS Code with REST Client extension."