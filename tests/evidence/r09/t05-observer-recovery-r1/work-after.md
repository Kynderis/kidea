# Công việc

Khung quy trình; không khẳng định đầu ra sản phẩm đã tồn tại.

<!-- kidea:data:start -->
```json
{
  "schemaVersion": 2,
  "projectId": "36ea2fe5-f510-4003-ba02-199f7a723322",
  "kind": "work",
  "currentRoundId": "ROUND-001",
  "currentItemId": "W-009-ADMIN-OPS",
  "rounds": [
    {
      "id": "ROUND-001",
      "name": "MVP — bắt đầu làm rõ, chưa duyệt phạm vi",
      "type": "MVP",
      "scopeRefs": [
        {
          "path": "docs/features.md",
          "anchor": "goal"
        },
        {
          "path": ".kidea/checkpoints/operations/6f769ada-2912-47ac-a531-de55097abb08/input-0.md",
          "anchor": null
        }
      ],
      "targetVersion": null,
      "releaseRef": null
    }
  ],
  "items": [
    {
      "id": "W-001",
      "roundId": "ROUND-001",
      "name": "Ý tưởng và phạm vi",
      "kind": "STEP",
      "parentId": null,
      "shape": "GROUP",
      "decomposition": "COMPLETE",
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "scope"
      },
      "dependencyIds": [],
      "gateIds": [
        "R09-REPLAN-LEGACY-r1"
      ],
      "resultRefs": [],
      "executionStatus": null
    },
    {
      "id": "W-001-CONTENT",
      "roundId": "ROUND-001",
      "name": "Đối chiếu nội dung đã nghiệm thu",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "scope"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [
        {
          "path": "docs/features.md",
          "anchor": null
        },
        {
          "path": "docs/workflow/legacy-provenance-r1.json",
          "anchor": null
        }
      ],
      "executionStatus": "DONE"
    },
    {
      "id": "W-002",
      "roundId": "ROUND-001",
      "name": "Nghiệp vụ",
      "kind": "STEP",
      "parentId": null,
      "shape": "GROUP",
      "decomposition": "COMPLETE",
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "business"
      },
      "inputRefs": [
        {
          "path": "docs/business/INDEX.md",
          "anchor": null
        },
        {
          "path": "docs/business/features/admin.md",
          "anchor": null
        },
        {
          "path": "docs/business/features/register-cancel.md",
          "anchor": null
        },
        {
          "path": "docs/business/features/updates.md",
          "anchor": null
        },
        {
          "path": "docs/business/features/view.md",
          "anchor": null
        },
        {
          "path": "docs/business/shared/availability.md",
          "anchor": null
        },
        {
          "path": "docs/business/shared/registration.md",
          "anchor": null
        },
        {
          "path": "docs/business/shared/workshop.md",
          "anchor": null
        },
        {
          "path": "docs/business/tests.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "business"
      },
      "dependencyIds": [
        "W-001"
      ],
      "gateIds": [
        "R09-REPLAN-LEGACY-r1"
      ],
      "resultRefs": [],
      "executionStatus": null
    },
    {
      "id": "W-002-CONTENT",
      "roundId": "ROUND-001",
      "name": "Đối chiếu nội dung đã nghiệm thu",
      "kind": "TASK",
      "parentId": "W-002",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "business"
      },
      "inputRefs": [
        {
          "path": "docs/business/INDEX.md",
          "anchor": null
        },
        {
          "path": "docs/business/features/admin.md",
          "anchor": null
        },
        {
          "path": "docs/business/features/register-cancel.md",
          "anchor": null
        },
        {
          "path": "docs/business/features/updates.md",
          "anchor": null
        },
        {
          "path": "docs/business/features/view.md",
          "anchor": null
        },
        {
          "path": "docs/business/shared/availability.md",
          "anchor": null
        },
        {
          "path": "docs/business/shared/registration.md",
          "anchor": null
        },
        {
          "path": "docs/business/shared/workshop.md",
          "anchor": null
        },
        {
          "path": "docs/business/tests.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "business"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [
        {
          "path": "docs/business/INDEX.md",
          "anchor": null
        },
        {
          "path": "docs/business/features/admin.md",
          "anchor": null
        },
        {
          "path": "docs/business/features/register-cancel.md",
          "anchor": null
        },
        {
          "path": "docs/business/features/updates.md",
          "anchor": null
        },
        {
          "path": "docs/business/features/view.md",
          "anchor": null
        },
        {
          "path": "docs/business/shared/availability.md",
          "anchor": null
        },
        {
          "path": "docs/business/shared/registration.md",
          "anchor": null
        },
        {
          "path": "docs/business/shared/workshop.md",
          "anchor": null
        },
        {
          "path": "docs/business/tests.md",
          "anchor": null
        },
        {
          "path": "docs/workflow/legacy-provenance-r1.json",
          "anchor": null
        }
      ],
      "executionStatus": "DONE"
    },
    {
      "id": "W-003",
      "roundId": "ROUND-001",
      "name": "Yêu cầu chất lượng",
      "kind": "STEP",
      "parentId": null,
      "shape": "GROUP",
      "decomposition": "COMPLETE",
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "quality"
      },
      "inputRefs": [
        {
          "path": "docs/design/quality.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "quality"
      },
      "dependencyIds": [
        "W-002"
      ],
      "gateIds": [
        "R09-REPLAN-LEGACY-r1"
      ],
      "resultRefs": [],
      "executionStatus": null
    },
    {
      "id": "W-003-CONTENT",
      "roundId": "ROUND-001",
      "name": "Đối chiếu nội dung đã nghiệm thu",
      "kind": "TASK",
      "parentId": "W-003",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "quality"
      },
      "inputRefs": [
        {
          "path": "docs/design/quality.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "quality"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [
        {
          "path": "docs/design/quality.md",
          "anchor": null
        },
        {
          "path": "docs/workflow/legacy-provenance-r1.json",
          "anchor": null
        }
      ],
      "executionStatus": "DONE"
    },
    {
      "id": "W-004",
      "roundId": "ROUND-001",
      "name": "Trải nghiệm",
      "kind": "STEP",
      "parentId": null,
      "shape": "GROUP",
      "decomposition": "COMPLETE",
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "experience"
      },
      "inputRefs": [
        {
          "path": "docs/design/experience.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "experience"
      },
      "dependencyIds": [
        "W-003"
      ],
      "gateIds": [
        "R09-REPLAN-LEGACY-r1"
      ],
      "resultRefs": [],
      "executionStatus": null
    },
    {
      "id": "W-004-CONTENT",
      "roundId": "ROUND-001",
      "name": "Đối chiếu nội dung đã nghiệm thu",
      "kind": "TASK",
      "parentId": "W-004",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "experience"
      },
      "inputRefs": [
        {
          "path": "docs/design/experience.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "experience"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [
        {
          "path": "docs/design/experience.md",
          "anchor": null
        },
        {
          "path": "docs/workflow/legacy-provenance-r1.json",
          "anchor": null
        }
      ],
      "executionStatus": "DONE"
    },
    {
      "id": "W-005",
      "roundId": "ROUND-001",
      "name": "Monitoring và vận hành",
      "kind": "STEP",
      "parentId": null,
      "shape": "GROUP",
      "decomposition": "COMPLETE",
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "operations"
      },
      "inputRefs": [
        {
          "path": "docs/design/operations.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "operations"
      },
      "dependencyIds": [
        "W-004"
      ],
      "gateIds": [
        "R09-REPLAN-LEGACY-r1"
      ],
      "resultRefs": [],
      "executionStatus": null
    },
    {
      "id": "W-005-CONTENT",
      "roundId": "ROUND-001",
      "name": "Đối chiếu nội dung đã nghiệm thu",
      "kind": "TASK",
      "parentId": "W-005",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "operations"
      },
      "inputRefs": [
        {
          "path": "docs/design/operations.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "operations"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [
        {
          "path": "docs/design/operations.md",
          "anchor": null
        },
        {
          "path": "docs/workflow/legacy-provenance-r1.json",
          "anchor": null
        }
      ],
      "executionStatus": "DONE"
    },
    {
      "id": "W-006",
      "roundId": "ROUND-001",
      "name": "Quản trị",
      "kind": "STEP",
      "parentId": null,
      "shape": "GROUP",
      "decomposition": "COMPLETE",
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "admin"
      },
      "inputRefs": [
        {
          "path": "docs/design/admin.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "admin"
      },
      "dependencyIds": [
        "W-005"
      ],
      "gateIds": [
        "R09-REPLAN-LEGACY-r1"
      ],
      "resultRefs": [],
      "executionStatus": null
    },
    {
      "id": "W-006-CONTENT",
      "roundId": "ROUND-001",
      "name": "Đối chiếu nội dung đã nghiệm thu",
      "kind": "TASK",
      "parentId": "W-006",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "admin"
      },
      "inputRefs": [
        {
          "path": "docs/design/admin.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "admin"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [
        {
          "path": "docs/design/admin.md",
          "anchor": null
        },
        {
          "path": "docs/workflow/legacy-provenance-r1.json",
          "anchor": null
        }
      ],
      "executionStatus": "DONE"
    },
    {
      "id": "W-007",
      "roundId": "ROUND-001",
      "name": "Kiến trúc",
      "kind": "STEP",
      "parentId": null,
      "shape": "GROUP",
      "decomposition": "COMPLETE",
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "architecture"
      },
      "inputRefs": [
        {
          "path": "docs/design/architecture.md",
          "anchor": null
        },
        {
          "path": "docs/engineering/rules.md",
          "anchor": null
        },
        {
          "path": "docs/engineering/cpp.md",
          "anchor": null
        },
        {
          "path": "docs/engineering/web.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "architecture"
      },
      "dependencyIds": [
        "W-006"
      ],
      "gateIds": [
        "R09-REPLAN-LEGACY-r1"
      ],
      "resultRefs": [],
      "executionStatus": null
    },
    {
      "id": "W-007-CONTENT",
      "roundId": "ROUND-001",
      "name": "Đối chiếu nội dung đã nghiệm thu",
      "kind": "TASK",
      "parentId": "W-007",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "architecture"
      },
      "inputRefs": [
        {
          "path": "docs/design/architecture.md",
          "anchor": null
        },
        {
          "path": "docs/engineering/rules.md",
          "anchor": null
        },
        {
          "path": "docs/engineering/cpp.md",
          "anchor": null
        },
        {
          "path": "docs/engineering/web.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "architecture"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [
        {
          "path": "docs/design/architecture.md",
          "anchor": null
        },
        {
          "path": "docs/engineering/rules.md",
          "anchor": null
        },
        {
          "path": "docs/engineering/cpp.md",
          "anchor": null
        },
        {
          "path": "docs/engineering/web.md",
          "anchor": null
        },
        {
          "path": "docs/workflow/legacy-provenance-r1.json",
          "anchor": null
        }
      ],
      "executionStatus": "DONE"
    },
    {
      "id": "W-008",
      "roundId": "ROUND-001",
      "name": "Test kỹ thuật",
      "kind": "STEP",
      "parentId": null,
      "shape": "GROUP",
      "decomposition": "COMPLETE",
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "technical-tests"
      },
      "inputRefs": [
        {
          "path": "docs/engineering/tests.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "technical-tests"
      },
      "dependencyIds": [
        "W-007"
      ],
      "gateIds": [
        "R09-REPLAN-LEGACY-r1"
      ],
      "resultRefs": [],
      "executionStatus": null
    },
    {
      "id": "W-008-CONTENT",
      "roundId": "ROUND-001",
      "name": "Đối chiếu nội dung đã nghiệm thu",
      "kind": "TASK",
      "parentId": "W-008",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "technical-tests"
      },
      "inputRefs": [
        {
          "path": "docs/engineering/tests.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "technical-tests"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [
        {
          "path": "docs/engineering/tests.md",
          "anchor": null
        },
        {
          "path": "docs/workflow/legacy-provenance-r1.json",
          "anchor": null
        }
      ],
      "executionStatus": "DONE"
    },
    {
      "id": "W-009",
      "roundId": "ROUND-001",
      "name": "Lộ trình và triển khai",
      "kind": "STEP",
      "parentId": null,
      "shape": "GROUP",
      "decomposition": "COMPLETE",
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "implementation"
      },
      "inputRefs": [
        {
          "path": "docs/workflow/r09-checkpoint-r1.md",
          "anchor": null
        },
        {
          "path": "docs/engineering/tests.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "implementation"
      },
      "dependencyIds": [
        "W-008"
      ],
      "gateIds": [
        "R09-REPLAN-LEGACY-r1"
      ],
      "resultRefs": [],
      "executionStatus": null
    },
    {
      "id": "W-009-BACKEND",
      "roundId": "ROUND-001",
      "name": "Kiểm lát backend nền",
      "kind": "TASK",
      "parentId": "W-009",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "backend-leaf"
      },
      "inputRefs": [
        {
          "path": "docs/workflow/r09-checkpoint-r1.md",
          "anchor": null
        },
        {
          "path": "docs/engineering/tests.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "backend-leaf"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [
        {
          "path": "docs/workflow/evidence/backend-r10.json",
          "anchor": null
        }
      ],
      "executionStatus": "DONE"
    },
    {
      "id": "W-009-WEB",
      "roundId": "ROUND-001",
      "name": "Kiểm lát Web đầu tiên",
      "kind": "TASK",
      "parentId": "W-009",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "web-leaf"
      },
      "inputRefs": [
        {
          "path": "docs/workflow/r09-checkpoint-r1.md",
          "anchor": null
        },
        {
          "path": "docs/engineering/tests.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "web-leaf"
      },
      "dependencyIds": [
        "W-009-BACKEND"
      ],
      "gateIds": [],
      "resultRefs": [
        {
          "path": "docs/workflow/evidence/https-r3.json",
          "anchor": null
        },
        {
          "path": "docs/workflow/evidence/https-manifest-r3.json",
          "anchor": null
        }
      ],
      "executionStatus": "DONE"
    },
    {
      "id": "W-009-MAX2",
      "roundId": "ROUND-001",
      "name": "Impact giới hạn hai ACTIVE khi MVP dở",
      "kind": "TASK",
      "parentId": "W-009",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "max2-leaf"
      },
      "inputRefs": [
        {
          "path": "docs/workflow/r09-checkpoint-r1.md",
          "anchor": null
        },
        {
          "path": "docs/engineering/tests.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "max2-leaf"
      },
      "dependencyIds": [
        "W-009-WEB"
      ],
      "gateIds": [],
      "resultRefs": [
        {
          "path": "docs/t04/report-r1.md",
          "anchor": null
        },
        {
          "path": ".kidea/reviews/R09-T04-OUTPUT-r1.md",
          "anchor": null
        }
      ],
      "executionStatus": "DONE"
    },
    {
      "id": "W-009-ADMIN-OPS",
      "roundId": "ROUND-001",
      "name": "Hoàn thiện admin, sự kiện và vận hành",
      "kind": "TASK",
      "parentId": "W-009",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "admin-ops-leaf"
      },
      "inputRefs": [
        {
          "path": "docs/workflow/r09-checkpoint-r1.md",
          "anchor": null
        },
        {
          "path": "docs/engineering/tests.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "admin-ops-leaf"
      },
      "dependencyIds": [
        "W-009-MAX2"
      ],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "IN_PROGRESS"
    },
    {
      "id": "W-009-G2",
      "roundId": "ROUND-001",
      "name": "Kiểm toàn bộ nguồn cuối",
      "kind": "TASK",
      "parentId": "W-009",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "g2-leaf"
      },
      "inputRefs": [
        {
          "path": "docs/workflow/r09-checkpoint-r1.md",
          "anchor": null
        },
        {
          "path": "docs/engineering/tests.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "g2-leaf"
      },
      "dependencyIds": [
        "W-009-ADMIN-OPS"
      ],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "W-010",
      "roundId": "ROUND-001",
      "name": "Triển khai và xác nhận vận hành",
      "kind": "STEP",
      "parentId": null,
      "shape": "GROUP",
      "decomposition": "COMPLETE",
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "release"
      },
      "inputRefs": [
        {
          "path": "docs/workflow/r09-checkpoint-r1.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "release"
      },
      "dependencyIds": [
        "W-009"
      ],
      "gateIds": [
        "R09-REPLAN-LEGACY-r1"
      ],
      "resultRefs": [],
      "executionStatus": null
    },
    {
      "id": "W-010-PREPARE",
      "roundId": "ROUND-001",
      "name": "Chuẩn bị exact release lab và script",
      "kind": "TASK",
      "parentId": "W-010",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "release"
      },
      "inputRefs": [
        {
          "path": "docs/workflow/r09-checkpoint-r1.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "release"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "W-010-HUMAN-PROD",
      "roundId": "ROUND-001",
      "name": "Human thực hiện vai PROD trên lab",
      "kind": "TASK",
      "parentId": "W-010",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "release"
      },
      "inputRefs": [
        {
          "path": "docs/workflow/r09-checkpoint-r1.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "release"
      },
      "dependencyIds": [
        "W-010-PREPARE"
      ],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "W-010-READBACK",
      "roundId": "ROUND-001",
      "name": "Đối chiếu running identity và restore",
      "kind": "TASK",
      "parentId": "W-010",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "release"
      },
      "inputRefs": [
        {
          "path": "docs/workflow/r09-checkpoint-r1.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "release"
      },
      "dependencyIds": [
        "W-010-HUMAN-PROD"
      ],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "W-010-ACCEPT",
      "roundId": "ROUND-001",
      "name": "Nghiệm thu vận hành đúng phạm vi",
      "kind": "TASK",
      "parentId": "W-010",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "release"
      },
      "inputRefs": [
        {
          "path": "docs/workflow/r09-checkpoint-r1.md",
          "anchor": null
        }
      ],
      "completionRef": {
        "path": "docs/workflow/r09-checkpoint-r1.md",
        "anchor": "release"
      },
      "dependencyIds": [
        "W-010-READBACK"
      ],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    }
  ],
  "planRefs": [
    {
      "path": ".kidea/plans/impact.md",
      "anchor": null
    }
  ],
  "reviewRefs": [
    {
      "path": ".kidea/reviews/R09-REPLAN-LEGACY-r1.md",
      "anchor": null
    },
    {
      "path": ".kidea/reviews/R09-T04-OUTPUT-r1.md",
      "anchor": null
    }
  ],
  "blockers": [
    {
      "itemId": "W-010",
      "reason": "Chưa lập gói duyệt bước này.",
      "needed": "Có đầu ra thực, lập gói đúng chủ thể/phạm vi/bản và được Human duyệt còn hiệu lực; N/A cũng cần xác nhận riêng."
    }
  ],
  "returnStack": [],
  "nextAction": "Đã làm (ghi nhận, không tự xác nhận DONE): Additive observer source8779453:29Mac unit/component tests with controlled logical clock and actual loopbackTLS, offline zero-runtime-dependency npmci/lint,15uniqueLinuxDockerTLSChrome selectors on final source PASS,0skip/cancel/todo. Strict nonce/sequence/source/schema/clock/freshness; fsync incident checkpoint and SIGKILL child restart preserve history, stale/missing/permission cannot create green, recovery at source cadence, count/coalescing/reminders. Real fallback receiver timings final1.569s pending and9.800s synthetic source-processdown, unchanged8/17s anddetect-to-show5s budgets. Same-host topology/receiver remain unverified and writeReady always false. All5attempts/FAIL/lint/preflight proofs retained; unchanged UID/private guards resolved via container-created private child. Existing backend112source/artifact/Web132HTTPS22SQL/core293 reused, not new runs. Original137ledger11covered88partial38NOT_RUN unchanged; no global OP promotion. Review9DRAFT.\nCòn dở: Real C++ telemetry/open-error sources and primarySvelteW5, verified online backup/watermark/receipt, backend admission/readiness/lifecycle; missing functional/input/arrival cases, independent-host clock/topology/receiver/Human oncall/E1/WQ andT08release/restore. Semantic impact/G2/final Human acceptance open; nativeFutureunscheduled/AppleSiliconNOT_RUN/R10unopened.\nTiếp theo: Next implement and fully verify real backend telemetry/open-error sources and primaryW5 with strict admin/collector permissions. Freeze complete source; backend changes require full4presets under unchangedEXr2 and resource baseline. Preserve observer component facts and synthetic-scope limits; no readiness/backup/host/E1/WQ claim until actual proof and required authority.",
  "checkpointRef": {
    "path": ".kidea/checkpoints/operations/bef9054c-51f3-4f07-a54b-0892fc95247d/checkpoint.md",
    "anchor": null
  }
}
```
<!-- kidea:data:end -->

<a id="step-1-scope"></a>
## 1. Ý tưởng và phạm vi

Chốt mục tiêu, người dùng, phạm vi và Feature Map; phân biệt MVP, Future và Idea.

<a id="step-1-completion"></a>
### Điều kiện hoàn tất

Có đầu ra thực theo phạm vi bước; kiểm tra áp dụng có bằng chứng, đồng bộ tài liệu và xử lý cleanup đúng điều kiện giữ bằng chứng. Bắt buộc có gói Human review đúng chủ thể/phạm vi/bản và approval còn hiệu lực; trường hợp N/A cần gói/xác nhận riêng. Không được suy hoàn tất từ việc đã phân rã hoặc thứ tự bước.

<a id="step-2-scope"></a>
## 2. Nghiệp vụ

Đối chiếu luồng nghiệp vụ, điều kiện chấp nhận và business test.

<a id="step-2-completion"></a>
### Điều kiện hoàn tất

Có đầu ra thực theo phạm vi bước; kiểm tra áp dụng có bằng chứng, đồng bộ tài liệu và xử lý cleanup đúng điều kiện giữ bằng chứng. Bắt buộc có gói Human review đúng chủ thể/phạm vi/bản và approval còn hiệu lực; trường hợp N/A cần gói/xác nhận riêng. Không được suy hoàn tất từ việc đã phân rã hoặc thứ tự bước.

<a id="step-3-scope"></a>
## 3. Yêu cầu chất lượng

Xác định yêu cầu phi chức năng, ngưỡng đo và cách kiểm chứng phù hợp.

<a id="step-3-completion"></a>
### Điều kiện hoàn tất

Có đầu ra thực theo phạm vi bước; kiểm tra áp dụng có bằng chứng, đồng bộ tài liệu và xử lý cleanup đúng điều kiện giữ bằng chứng. Bắt buộc có gói Human review đúng chủ thể/phạm vi/bản và approval còn hiệu lực; trường hợp N/A cần gói/xác nhận riêng. Không được suy hoàn tất từ việc đã phân rã hoặc thứ tự bước.

<a id="step-4-scope"></a>
## 4. Trải nghiệm

Xác định trải nghiệm, luồng sử dụng và tiêu chí kiểm tra; xét SEO khi áp dụng.

<a id="step-4-completion"></a>
### Điều kiện hoàn tất

Có đầu ra thực theo phạm vi bước; kiểm tra áp dụng có bằng chứng, đồng bộ tài liệu và xử lý cleanup đúng điều kiện giữ bằng chứng. Bắt buộc có gói Human review đúng chủ thể/phạm vi/bản và approval còn hiệu lực; trường hợp N/A cần gói/xác nhận riêng. Không được suy hoàn tất từ việc đã phân rã hoặc thứ tự bước.

<a id="step-5-scope"></a>
## 5. Monitoring và vận hành

Xác định tín hiệu theo dõi, cảnh báo và quy trình vận hành.

<a id="step-5-completion"></a>
### Điều kiện hoàn tất

Có đầu ra thực theo phạm vi bước; kiểm tra áp dụng có bằng chứng, đồng bộ tài liệu và xử lý cleanup đúng điều kiện giữ bằng chứng. Bắt buộc có gói Human review đúng chủ thể/phạm vi/bản và approval còn hiệu lực; trường hợp N/A cần gói/xác nhận riêng. Không được suy hoàn tất từ việc đã phân rã hoặc thứ tự bước.

<a id="step-6-scope"></a>
## 6. Quản trị

Xác định nhu cầu admin và quyền quản trị; đối chiếu trường hợp không áp dụng.

<a id="step-6-completion"></a>
### Điều kiện hoàn tất

Có đầu ra thực theo phạm vi bước; kiểm tra áp dụng có bằng chứng, đồng bộ tài liệu và xử lý cleanup đúng điều kiện giữ bằng chứng. Bắt buộc có gói Human review đúng chủ thể/phạm vi/bản và approval còn hiệu lực; trường hợp N/A cần gói/xác nhận riêng. Không được suy hoàn tất từ việc đã phân rã hoặc thứ tự bước.

<a id="step-7-scope"></a>
## 7. Kiến trúc

Chốt kiến trúc, hợp đồng giữa thành phần và quy tắc triển khai code.

<a id="step-7-completion"></a>
### Điều kiện hoàn tất

Có đầu ra thực theo phạm vi bước; kiểm tra áp dụng có bằng chứng, đồng bộ tài liệu và xử lý cleanup đúng điều kiện giữ bằng chứng. Bắt buộc có gói Human review đúng chủ thể/phạm vi/bản và approval còn hiệu lực; trường hợp N/A cần gói/xác nhận riêng. Không được suy hoàn tất từ việc đã phân rã hoặc thứ tự bước.

<a id="step-8-scope"></a>
## 8. Test kỹ thuật

Xác định và kiểm chứng kế hoạch test kỹ thuật theo nguồn đã duyệt.

<a id="step-8-completion"></a>
### Điều kiện hoàn tất

Có đầu ra thực theo phạm vi bước; kiểm tra áp dụng có bằng chứng, đồng bộ tài liệu và xử lý cleanup đúng điều kiện giữ bằng chứng. Bắt buộc có gói Human review đúng chủ thể/phạm vi/bản và approval còn hiệu lực; trường hợp N/A cần gói/xác nhận riêng. Không được suy hoàn tất từ việc đã phân rã hoặc thứ tự bước.

<a id="step-9-scope"></a>
## 9. Lộ trình và triển khai

Lập lộ trình, được Human duyệt rồi mới triển khai theo phạm vi/quyền được cấp.

<a id="step-9-completion"></a>
### Điều kiện hoàn tất

Có đầu ra thực theo phạm vi bước; kiểm tra áp dụng có bằng chứng, đồng bộ tài liệu và xử lý cleanup đúng điều kiện giữ bằng chứng. Bắt buộc có gói Human review đúng chủ thể/phạm vi/bản và approval còn hiệu lực; trường hợp N/A cần gói/xác nhận riêng. Không được suy hoàn tất từ việc đã phân rã hoặc thứ tự bước.

<a id="step-10-scope"></a>
## 10. Triển khai và xác nhận vận hành

Chỉ triển khai khi có quyền; giữ bằng chứng kết quả và xác nhận vận hành, không suy thành công từ dự kiến.

<a id="step-10-completion"></a>
### Điều kiện hoàn tất

Có đầu ra thực theo phạm vi bước; kiểm tra áp dụng có bằng chứng, đồng bộ tài liệu và xử lý cleanup đúng điều kiện giữ bằng chứng. Bắt buộc có gói Human review đúng chủ thể/phạm vi/bản và approval còn hiệu lực; trường hợp N/A cần gói/xác nhận riêng. Không được suy hoàn tất từ việc đã phân rã hoặc thứ tự bước.
