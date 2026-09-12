# Công việc mẫu

DỮ LIỆU GIẢ. Không phải công việc, approval hoặc bằng chứng chạy thật. Nguồn JSON theo hợp đồng R02-T02; không gọi skill trên fixture để thực hiện công việc.

<!-- kidea:data:start -->
```json
{
  "schemaVersion": 1,
  "projectId": "fixture-r02-t02",
  "kind": "work",
  "currentRoundId": "D-001",
  "currentItemId": "W-013",
  "rounds": [
    {
      "id": "D-001",
      "name": "Mẫu phân rã phạm vi",
      "type": "MVP",
      "scopeRefs": [
        {
          "path": "tài liệu/đặc tả.md",
          "anchor": "scope"
        }
      ],
      "targetVersion": null,
      "releaseRef": null
    }
  ],
  "items": [
    {
      "id": "W-001",
      "roundId": "D-001",
      "name": "Ý tưởng và phạm vi",
      "kind": "STEP",
      "parentId": null,
      "shape": "GROUP",
      "decomposition": "PARTIAL",
      "scopeRef": {
        "path": "tài liệu/đặc tả.md",
        "anchor": "step-1"
      },
      "inputRefs": [
        {
          "path": "tài liệu/đặc tả.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "tài liệu/đặc tả.md",
        "anchor": "done-1"
      },
      "dependencyIds": [],
      "gateIds": [
        "RV-001"
      ],
      "resultRefs": [],
      "executionStatus": null
    },
    {
      "id": "W-002",
      "roundId": "D-001",
      "name": "Nhóm việc còn cần phân rã",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "GROUP",
      "decomposition": "UNEXPANDED",
      "scopeRef": {
        "path": "tài liệu/đặc tả.md",
        "anchor": "later-group"
      },
      "inputRefs": [
        {
          "path": "tài liệu/đặc tả.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "tài liệu/đặc tả.md",
        "anchor": "done-later-group"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": null
    },
    {
      "id": "W-011",
      "roundId": "D-001",
      "name": "Lập ví dụ phạm vi",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "tài liệu/đặc tả.md",
        "anchor": "task-011"
      },
      "inputRefs": [
        {
          "path": "tài liệu/đặc tả.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "tài liệu/đặc tả.md",
        "anchor": "done-011"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [
        {
          "path": "tài liệu/đặc tả.md",
          "anchor": "example-result"
        }
      ],
      "executionStatus": "DONE"
    },
    {
      "id": "W-012",
      "roundId": "D-001",
      "name": "Soạn quy tắc hủy",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "tài liệu/đặc tả.md",
        "anchor": "task-012"
      },
      "inputRefs": [
        {
          "path": "tài liệu/đặc tả.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "tài liệu/đặc tả.md",
        "anchor": "done-012"
      },
      "dependencyIds": [
        "W-013"
      ],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "IN_PROGRESS"
    },
    {
      "id": "W-013",
      "roundId": "D-001",
      "name": "Làm rõ người được hủy",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "tài liệu/đặc tả.md",
        "anchor": "task-013"
      },
      "inputRefs": [
        {
          "path": "tài liệu/đặc tả.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "tài liệu/đặc tả.md",
        "anchor": "done-013"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "IN_PROGRESS"
    }
  ],
  "planRefs": [],
  "reviewRefs": [
    {
      "path": ".kidea/reviews/RV-001.md",
      "anchor": null
    }
  ],
  "blockers": [],
  "returnStack": [
    {
      "itemId": "W-012",
      "reason": "Cần làm rõ người có quyền hủy trước khi soạn quy tắc.",
      "nextAction": "Quay lại bổ sung quy tắc theo kết luận của W-013."
    }
  ],
  "nextAction": "Làm rõ quyền hủy ở W-013; sau đó quay lại W-012. Chưa chốt version, chưa có checkpoint hoặc căn cứ bản đã triển khai.",
  "checkpointRef": null
}
```
<!-- kidea:data:end -->
