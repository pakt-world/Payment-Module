enum Roles {
    EMPTY = "",
    CREATOR = "creator",
    RECIPIENT = "recipient",
}

enum Bucket {
    ChainsiteStorage = "chainsite-storage",
}

enum JobCategory {
    Design = "design",
    Engineering = "engineering",
    Content = "content",
    Marketing = "marketing",
    Events = "events",
    Others = "others",
}

enum CollectionTypes {
    JOB = "job",
    COLLECTION = "collection",
    APPLICATION = "application",
    DELIVERABLE = "deliverable",
    CANCELLATION = "cancellation",
    REVIEW_CHANGE_REQUEST = "review_change_request",
}

enum CollectionStatus {
    PENDING = "pending",
    ONGOING = "ongoing",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    WAITING = "waiting", // Not so used
    CANCEL_REQUESTED = "cancel_requested", // Not so used
}

export { Roles, Bucket, JobCategory, CollectionTypes, CollectionStatus };
