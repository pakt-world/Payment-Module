import {
    Bucket,
    CollectionStatus,
    CollectionTypes,
    JobCategory,
    Roles,
} from "./enums";

interface Contact {
    state: string;
    city: string;
    country: string;
}

interface Bio {
    title: Roles;
    description: string;
}

interface TagsID {
    _id: string;
    name: string;
    categories: unknown[];
    isParent: boolean;
    type: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    entryCount: number;
    key?: string;
    color?: string;
}

interface ProfileImage {
    _id: string;
    name: string;
    type: string;
    size: string;
    url: string;
    bucket?: Bucket;
}

interface Talent {
    tags: string[];
    tagsIds: TagsID[];
}

interface Profile {
    contact: Contact;
    bio: Bio;
    talent: Talent;
}

interface ProfileLinks {
    website: string;
    x: string;
    tiktok: string;
    instagram: string;
    github: string;
}

interface Meta {
    profileLinks: ProfileLinks;
}

interface CoinProps {
    active: boolean;
    createdAt: string;
    decimal: string;
    icon: string;
    isToken: boolean;
    name: string;
    reference: string;
    rpcChainId: string;
    symbol: string;
    updatedAt: string;
    __v: number;
    _id: string;
}

interface MetaProps {
    coin: CoinProps;
    slotCount: number;
    completedAt?: string; // Date string
    [other: string]: unknown;
}

interface TalentProps {
    _id: string;
    firstName: string;
    lastName: string;
    type: Roles;
    role: Roles;
    profile: Profile;
    isPrivate: boolean;
    score: number;
    profileCompleteness: number;
    profileImage: ProfileImage;
    meta: Meta;
}

interface CollectionProps {
    _id: string;
    creator: TalentProps;
    name: string;
    category: JobCategory;
    description: string;
    equity: string;
    parent: CollectionProps;
    collections: CollectionProps[]; // Recursive - Empty on aware instance
    type: CollectionTypes;
    owners: unknown[] | string[];
    attachments: unknown[];
    attachmentData: unknown[];
    tagsData: string[];
    status: CollectionStatus;
    inviteAccepted: boolean;
    isPrivate: boolean;
    recipientCompletedJob: boolean;
    score: number;
    progress: number;
    isDeleted: boolean;
    payoutTransactions: unknown[];
    failedPayoutCount: number;
    failedFeePayoutCount: number;
    failedPaktFeePayoutCount: number;
    isParentFunded: boolean;
    __v: number;
    createdAt: string; // Date string
    updatedAt: Date;
    paymentFee: number;
    deliveryDate?: string; // Date string
    meta: MetaProps;
    owner?: TalentProps;
    wallet?: string;
    chainId?: string;
    charges?: string;
    expectedAmount?: string;
    feePercentage?: string;
    paktCharges?: string;
    paktFeePercentage?: string;
    paymentAddress?: string;
    rate?: string;
    usdExpectedAmount?: string;
    usdExpectedFee?: string;
    escrowPaid?: boolean;
    isBookmarked?: boolean;
    bookmarkId?: string;
}

interface DateMessage {
    category: "date";
    content: string; // The date string or formatted date content
    key: string;
}

interface MessageProps {
    _id: string;
    user: string;
    type: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    isFirstMessage?: boolean;
    attachments: {
        _id: string;
        name: string;
        type: string;
        size: string;
        url: string;
    }[];
}

type TMessage = Partial<DateMessage> & Partial<MessageProps>;

interface ITheme {
    primary?: string;
    info?: string;
    secondary?: string;
    "blue-lightest"?: string;
    "blue-darkest"?: string;
    line?: string;
    title?: string;
    body?: string;
    warning?: string;
    success?: string;
    danger?: string;
    magnolia?: string;
    "exhibit-tab-list"?: string;
    "primary-brighter"?: string;
    "refer-border"?: string;
    "btn-primary"?: string;
    "primary-gradient"?: string;
    "modal-radius"?: string;
}

export {
    CollectionProps,
    TalentProps,
    DateMessage,
    MessageProps,
    TMessage,
    ITheme,
};
