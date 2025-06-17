"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Image from "next/image";

// Avatar image URLs (8 preset)
const avatars = [
  "https://github.com/github.png?size=40",
  "https://github.com/octocat.png?size=40",
  "https://github.com/hubot.png?size=40",
  "https://github.com/ghost.png?size=40",
  "https://github.com/gitster.png?size=40",
  "https://github.com/probot.png?size=40",
  "https://github.com/github-hero.png?size=40",
  "https://github.com/defunkt.png?size=40",
  "https://github.com/mojombo.png?size=40",
  "https://github.com/wycats.png?size=40",
  "https://github.com/rtomayko.png?size=40",
  "https://github.com/vanpelt.png?size=40",
  "https://github.com/ezmobius.png?size=40",
  "https://github.com/ivey.png?size=40",
  "https://github.com/evanphx.png?size=40",
  "https://github.com/wayneeseguin.png?size=40",
  "https://github.com/brynary.png?size=40",
  "https://github.com/kevinclark.png?size=40"
];

// TagInput component
function TagInput({ value, onChange, maxTags = 10, ...props }: {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}) {
  const [input, setInput] = useState("");
  const addTag = (tag: string) => {
    if (
      tag &&
      !value.includes(tag) &&
      value.length < maxTags &&
      tag.trim().length > 0
    ) {
      onChange([...value, tag]);
    }
  };
  const removeTag = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", " "].includes(e.key)) {
      e.preventDefault();
      addTag(input.trim());
      setInput("");
    } else if (e.key === "Backspace" && !input) {
      removeTag(value.length - 1);
    }
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag, i) => (
          <span
            key={tag}
            className="flex items-center bg-neutral-800 text-neutral-100 px-2 py-1 rounded-full text-xs"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              className="ml-1 text-neutral-400 hover:text-red-400"
              onClick={() => removeTag(i)}
              tabIndex={-1}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <Input
        {...props}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          value.length >= maxTags
            ? "Max tags reached"
            : "Type and press Space/Enter"
        }
        disabled={value.length >= maxTags}
        className="bg-neutral-900"
        aria-label="Add interests"
      />
    </div>
  );
}

// Zod schema
const branches = ["COE", "CSE", "ECE", "ME", "CIVIL", "EE", "BioTech", "Mechtronics"] as const;
const onboardingSchema = z.object({
  branch: z.enum(branches, { required_error: "Branch is required" }),
  year: z.enum(["1", "2", "3", "4"], { required_error: "Year is required" }),
  interests: z
    .array(z.string().min(1, "No empty tags"))
    .min(1, "At least 1 interest")
    .max(10, "Max 10 interests"),
  bio: z.string().max(100, "Max 100 characters"),
  wants_relationship: z.boolean(),
  wants_friendship: z.boolean(),
  avatar_url: z.string().url("Select an avatar"),
  communityGuidelines: z.boolean().refine(val => val === true, {
    message: "You must agree to the community guidelines"
  }),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      branch: undefined,
      year: undefined,
      interests: [],
      bio: "",
      wants_relationship: false,
      wants_friendship: false,
      avatar_url: "",
      communityGuidelines: false,
    },
  });

  // Fetch user and profile
  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/auth/login");
        return;
      }
      setUserId(user.id ?? null);
      setUserEmail(user.email ?? null);
      const { data: profile } = await supabase
        .from("profiles")
        .select("has_onboarded")
        .eq("id", user.id)
        .single();
      if (profile?.has_onboarded) {
        router.replace("/protected/dashboard");
        return;
      }
      setLoading(false);
    };
    fetchProfile();
  }, [router]);

  // Watch goals
  const wants_relationship = watch("wants_relationship");
  const wants_friendship = watch("wants_friendship");

  // Enforce at least one goal checked
  useEffect(() => {
    if (!wants_relationship && !wants_friendship) {
      setError("wants_relationship", {
        type: "manual",
        message: "Select at least one goal",
      });
      setError("wants_friendship", {
        type: "manual",
        message: "Select at least one goal",
      });
    } else {
      clearErrors(["wants_relationship", "wants_friendship"]);
    }

  }, [wants_relationship, wants_friendship, setError, clearErrors]);

  // Submit handler
  const onSubmit = async (data: OnboardingForm) => {
    console.log("Submitting form data:", data);
    if (!userId || !userEmail) return;
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      branch: data.branch,
      year: Number(data.year),
      interests: data.interests,
      bio: data.bio,
      wants_relationship: data.wants_relationship,
      wants_friendship: data.wants_friendship,
      avatar_url: data.avatar_url,
      has_onboarded: true,
      verified: userEmail.endsWith("@thapar.edu"),
      updated_at: new Date().toISOString(),
    });
    setSubmitting(false);
    if (error) {
      console.error("Supabase error:", error.message);
    } else {
      router.push("/protected/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-900">
        <span className="text-neutral-100 text-lg">Loading…</span>
      </div>
    );
  }

  return (
    <Card>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg mx-auto p-6 rounded-lg text-neutral-100 shadow-lg mt-8"
        autoComplete="off"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Complete Your tietU Profile</h1>

        {/* Branch */}
        <label className="block mb-1 font-medium" htmlFor="branch">
          Branch
        </label>
        <Controller
          control={control}
          name="branch"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              defaultValue={undefined}
            >
              <SelectTrigger id="branch" className="mb-2 bg-neutral-800">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.branch && (
          <p className="text-red-400 text-xs mb-2">{errors.branch.message}</p>
        )}

        {/* Year */}
        <label className="block mt-2 mb-1 font-medium" htmlFor="year">
          Year
        </label>
        <Controller
          control={control}
          name="year"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              defaultValue={undefined}
            >
              <SelectTrigger id="year" className="mb-2 bg-neutral-800">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.year && (
          <p className="text-red-400 text-xs mb-2">{errors.year.message}</p>
        )}

        {/* Interests */}
        <label className="block mt-2 mb-1 font-medium" htmlFor="interests">
          Interests
        </label>
        <Controller
          control={control}
          name="interests"
          render={({ field }) => (
            <TagInput
              value={field.value}
              onChange={field.onChange}
              maxTags={10}
            />
          )}
        />
        {errors.interests && (
          <p className="text-red-400 text-xs mb-2">{errors.interests.message}</p>
        )}

        {/* Bio */}
        <label className="block mt-2 mb-1 font-medium" htmlFor="bio">
          Bio <span className="text-xs text-neutral-400">(max 100 chars)</span>
        </label>
        <Textarea
          id="bio"
          maxLength={100}
          {...register("bio")}
          className="mb-1 bg-neutral-800"
          aria-describedby="bio-help"
        />
        <div className="flex justify-between mb-2">
          <span className="text-xs text-neutral-400" id="bio-help">
            {watch("bio")?.length || 0}/100
          </span>
          {errors.bio && (
            <span className="text-red-400 text-xs">{errors.bio.message}</span>
          )}
        </div>

        {/* Goals */}
        <label className="block mt-2 mb-1 font-medium">What are you looking for? 👀</label>
        <div className="flex gap-4 mb-2 text-2xl">
          <div className="flex items-center gap-2">
            <Checkbox
              id="wants_relationship"
              checked={wants_relationship}
              onCheckedChange={v => setValue("wants_relationship", !!v)}
            />
            <label htmlFor="wants_relationship" className="select-none">
              ❤️
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="wants_friendship"
              checked={wants_friendship}
              onCheckedChange={v => setValue("wants_friendship", !!v)}
            />
            <label htmlFor="wants_friendship" className="select-none">
              🤝
            </label>
          </div>
        </div>
        {(errors.wants_relationship || errors.wants_friendship) && (
          <p className="text-red-400 text-xs mb-2">
            {errors.wants_relationship?.message || errors.wants_friendship?.message}
          </p>
        )}

        {/* Avatar */}
        <label className="block mt-2 mb-1 font-medium">Choose an Avatar</label>
        <Controller
          control={control}
          name="avatar_url"
          render={({ field }) => (
            <div className="grid grid-cols-6 gap-3 mb-2">
              {avatars.map((url) => (
                <button
                  type="button"
                  key={url}
                  className={cn(
                    "w-16 h-16 rounded-full border-2 transition-all p-1",
                    field.value === url
                      ? "border-blue-500 ring-2 ring-blue-500"
                      : "border-transparent"
                  )}
                  onClick={() => field.onChange(url)}
                >
                  <Image
                    src={url}
                    alt="Avatar"
                    width={64}
                    height={64}
                    className="w-full h-full rounded-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        />
        {errors.avatar_url && (
          <p className="text-red-400 text-xs mb-2">{errors.avatar_url.message}</p>
        )}

        {/* Community Guidelines */}
        <div className="flex items-center gap-2 mt-4 mb-4">
          <Controller
            control={control}
            name="communityGuidelines"
            render={({ field }) => (
              <Checkbox
                id="communityGuidelines"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <label htmlFor="communityGuidelines" className="text-sm select-none">
            I agree to abide by the tietU Community Guidelines.
          </label>
        </div>
        {errors.communityGuidelines && (
          <p className="text-red-400 text-xs mb-2">{errors.communityGuidelines.message}</p>
        )}

        <Button
          type="submit"
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Finish Onboarding"}
        </Button>
      </form>
    </Card>
  );
}