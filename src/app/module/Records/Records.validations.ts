import { PostingStatus } from "@prisma/client";
import { z } from "zod";

const createRecordValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "Title is required",
        invalid_type_error: "Title should be a text",
      })
      .min(1, "Title is required"),
    campaign: z.string().optional(),
    product: z.string().optional(),
    stakeholder: z.string().optional(),
    posting_quality: z.string().optional(),
    google_drive_files: z.string().optional(),
    playbook_link: z.string().optional(),
    uppromote_conversion: z.number().int().min(0).default(0), // Integer, default 0
    asset_status: z.string().optional(),
    month_uploaded: z.string().optional(),
    REVO_pinterest: z.string().default("not-posted"),
    PIN_accounts_used: z.string().default("not-posted"),
    pinterest_PIN_click: z.number().int().min(0).default(0),
    pinterest_view: z.number().int().min(0).default(0),
    REVO_instagram: z.string().optional(),
    IG_like: z.number().int().min(0).default(0),
    IG_comment: z.number().int().min(0).default(0),
    IG_share: z.number().int().min(0).default(0),
    IG_view: z.number().int().min(0).default(0),
    IG_social_sets_used: z.string().optional(),
    partner_IG_link: z.string().optional(),
    REVO_twitter: z.string().default("not-posted"),
    REVO_tiktok: z.string().default("not-posted"),
    REVO_TT_view: z.number().int().min(0).default(0),
    tiktok_accounts_used: z.string().default("not-posted"),
    partner_tiktok_link: z.string().default("not-posted"),
    partner_TT_like: z.number().int().min(0).default(0),
    partner_TT_comment: z.number().int().min(0).default(0),
    partner_TT_share: z.number().int().min(0).default(0),
    partner_TT_view: z.number().int().min(0).default(0),
    partner_TT_save: z.number().int().min(0).default(0),
    TT_dummy_account_used: z.string().optional(),
    YT_account_used: z.string().default("not-posted"),
    partner_YT_link: z.string().default("not-posted"),
    partner_YT_like: z.number().int().min(0).default(0),
    partner_YT_comment: z.number().int().min(0).default(0),
    partner_YT_view: z.number().int().min(0).default(0),
    partner_YT_save: z.number().int().min(0).default(0),
    REVO_clubrevo_youtube: z.string().default("not-posted"),
    REVO_youtube: z.string().default("not-posted"),
    YT_clubrevo_like: z.number().int().min(0).default(0),
    YT_clubrevo_view: z.number().int().min(0).default(0),
    YT_REVOMADIC_like: z.number().int().min(0).default(0),
    YT_REVOMADIC_comment: z.number().int().min(0).default(0),
    YT_REVOMADIC_share: z.number().int().min(0).default(0),
    YT_REVOMADIC_view: z.number().int().min(0).default(0),
    creator_status: z.string().optional(),
    profile: z.string().optional(),
    posting_status: z
      .enum(Object.values(PostingStatus) as [string, ...string[]])
      .default(PostingStatus.NOT_POSTED),
    partner_HQ: z.string().optional(),
    portfolio: z.string().optional(),
    contributed_engagement: z.number().int().min(0).default(0),
    by_tags: z.array(z.string()).default([]),
    by_city: z.string().optional(),
    all_internet_search: z.string().optional(),
  }),
});

export const RecordsValidations = {
  createRecordValidationSchema,
};
