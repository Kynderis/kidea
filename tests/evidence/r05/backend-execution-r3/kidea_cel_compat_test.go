package caddyhttp

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/google/cel-go/cel"
	"github.com/google/cel-go/common/types"
	"github.com/google/cel-go/common/types/ref"
)

type kideaLegacyMatcher struct{}

func (kideaLegacyMatcher) Match(r *http.Request) bool { return r.Header.Get("X-Probe") == "yes" }

type kideaErrorMatcher struct{}

func (kideaErrorMatcher) MatchWithError(r *http.Request) (bool, error) {
	if r.Header.Get("X-Probe") == "error" {
		return false, errors.New("expected matcher error")
	}
	return r.Header.Get("X-Probe") == "yes", nil
}

func TestKideaCELFactoryCompatibility(t *testing.T) {
	for _, kind := range []string{"legacy", "with-error"} {
		t.Run(kind, func(t *testing.T) {
			calls := 0
			var factory any
			if kind == "legacy" {
				factory = CELMatcherFactory(func(data ref.Val) (RequestMatcher, error) {
					calls++
					if data != types.String("constant") {
						t.Fatal("constant lost")
					}
					return kideaLegacyMatcher{}, nil
				})
			} else {
				factory = CELMatcherWithErrorFactory(func(data ref.Val) (RequestMatcherWithError, error) {
					calls++
					if data != types.String("constant") {
						t.Fatal("constant lost")
					}
					return kideaErrorMatcher{}, nil
				})
			}
			library, err := CELMatcherImpl("kidea_check", "kidea_check_impl", []*cel.Type{cel.StringType}, factory)
			if err != nil {
				t.Fatal(err)
			}
			env, err := cel.NewEnv(cel.CustomTypeAdapter(celTypeAdapter{}), cel.Variable(CELRequestVarName, cel.ObjectType("http.Request")), cel.Lib(library))
			if err != nil {
				t.Fatal(err)
			}
			ast, issues := env.Compile(`kidea_check('constant')`)
			if issues.Err() != nil {
				t.Fatal(issues.Err())
			}
			program, err := env.Program(ast)
			if err != nil {
				t.Fatal(err)
			}
			if calls != 1 {
				t.Fatalf("constant matcher not compiled once: %d", calls)
			}
			for _, value := range []string{"yes", "no", "error"} {
				req := httptest.NewRequest("GET", "https://localhost/", nil)
				req.Header.Set("X-Probe", value)
				result, _, err := program.Eval(map[string]any{CELRequestVarName: celHTTPRequest{req}})
				if kind == "with-error" && value == "error" {
					if err == nil {
						t.Fatal("matcher error swallowed")
					}
					continue
				}
				if err != nil {
					t.Fatal(err)
				}
				if result != types.Bool(value == "yes") {
					t.Fatalf("unexpected result for %s: %v", value, result)
				}
			}
			if calls != 1 {
				t.Fatalf("compiled matcher recreated at runtime: %d", calls)
			}
		})
	}
}
