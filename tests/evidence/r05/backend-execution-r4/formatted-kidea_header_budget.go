package caddyhttp

import (
	"net/http"
	"strings"
)

// Count canonical HTTP header field bytes, including CRLF delimiters and Host.
// An int64 accumulator avoids overflow when fields are combined.
func kideaHeaderBytes(r *http.Request) int64 {
	var size int64 = 2 // final empty line
	if r.Host != "" {
		size += int64(len("Host: ") + len(r.Host) + 2)
	}
	for key, values := range r.Header {
		if strings.EqualFold(key, "Host") {
			continue
		}
		for _, value := range values {
			size += int64(len(key)) + 2 + int64(len(value)) + 2
		}
	}
	// net/http removes transfer-encoding from Header after parsing.
	if len(r.TransferEncoding) > 0 {
		size += int64(len("Transfer-Encoding: ") + len(strings.Join(r.TransferEncoding, ", ")) + 2)
	}
	return size
}
