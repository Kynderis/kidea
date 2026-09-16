package caddyhttp

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestKideaHeaderBudget(t *testing.T) {
	for _, version := range []int{1, 2} {
		for _, size := range []int{16383, 16384, 16385} {
			req := httptest.NewRequest("GET", "https://localhost:8443/api/health", nil)
			req.ProtoMajor = version
			req.Header.Set("Connection", "close")
			req.Header.Set("X-Padding", "")
			req.Header.Set("X-Padding", strings.Repeat("x", size-int(kideaHeaderBytes(req))))
			if got := kideaHeaderBytes(req); got != int64(size) {
				t.Fatalf("size: got %d want %d", got, size)
			}
			if size > 16384 {
				// No handler chain is installed: reaching routing would panic, not pass.
				server := &Server{MaxHeaderBytes: 16384}
				response := httptest.NewRecorder()
				server.ServeHTTP(response, req)
				if response.Code != http.StatusRequestHeaderFieldsTooLarge {
					t.Fatal("oversize reached routing")
				}
			}
		}
	}
	req := httptest.NewRequest("POST", "https://localhost:8443/", nil)
	req.Header["X-Many"] = []string{strings.Repeat("a", 8200), strings.Repeat("b", 8200)}
	if kideaHeaderBytes(req) <= 16384 {
		t.Fatal("duplicate fields not summed")
	}
	old := kideaHeaderBytes(req)
	req.TransferEncoding = []string{"chunked"}
	if kideaHeaderBytes(req) != old+int64(len("Transfer-Encoding: chunked\r\n")) {
		t.Fatal("transfer encoding omitted")
	}
}
