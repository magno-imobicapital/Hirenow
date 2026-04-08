import PageHeader from "@/components/page-header";
import { api } from "@/lib/api";
import ProfileForm from "./_components/profile-form";
import ResumeUpload from "./_components/resume-upload";

type Profile = {
  id: string;
  fullName: string;
  birthDate: string | null;
  about: string | null;
  mobilePhone: string | null;
  landlinePhone: string | null;
  salaryExpectation: number | string | null;
  resumeUrl: string | null;
};

export default async function ProfilePage() {
  const res = await api<Profile | null>("/profile");
  const profile = res.ok ? res.data : null;

  return (
    <div>
      <PageHeader
        pageName="Sua Conta"
        pageTitle="Meu Perfil"
        pageDescription="Mantenha seus dados atualizados para se candidatar às vagas."
      />
      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto pb-12 flex flex-col gap-6">
        <ResumeUpload resumeUrl={profile?.resumeUrl ?? null} />
        <ProfileForm
          exists={Boolean(profile)}
          defaultValues={
            profile
              ? {
                  fullName: profile.fullName,
                  birthDate: profile.birthDate
                    ? profile.birthDate.slice(0, 10)
                    : "",
                  about: profile.about ?? "",
                  mobilePhone: profile.mobilePhone ?? "",
                  landlinePhone: profile.landlinePhone ?? "",
                  salaryExpectation:
                    profile.salaryExpectation != null
                      ? Number(profile.salaryExpectation)
                      : undefined,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
