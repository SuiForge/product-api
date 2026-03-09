package integration_test

import (
    "os/exec"
    "strings"
    "testing"
)

func TestSmokeScript(t *testing.T) {
    t.Parallel()

    cmd := exec.Command("bash", "../scripts/smoke.sh")
    cmd.Dir = ".."
    output, err := cmd.CombinedOutput()
    if err != nil {
        t.Fatalf("smoke script failed: %v\n%s", err, string(output))
    }
    if !strings.Contains(string(output), "smoke ok") {
        t.Fatalf("expected smoke ok output, got: %s", string(output))
    }
}
