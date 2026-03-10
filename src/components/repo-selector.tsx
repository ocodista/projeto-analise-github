import { RepoSearch } from "./repo-search";
import { SuggestedRepos } from "./suggested-repos";
import { SelectedReposList } from "./selected-repos-list";

type RepoSelectorProps = {
  selectedRepos: string[];
  onAdd: (fullName: string) => void;
  onRemove: (fullName: string) => void;
};

export function RepoSelector({ selectedRepos, onAdd, onRemove }: RepoSelectorProps) {
  const handleAdd = (fullName: string) => {
    if (!selectedRepos.includes(fullName)) {
      onAdd(fullName);
    }
  };

  return (
    <div className="space-y-4">
      <RepoSearch onSelect={handleAdd} selectedRepos={selectedRepos} />
      <SuggestedRepos onSelect={handleAdd} selectedRepos={selectedRepos} />
      <SelectedReposList repos={selectedRepos} onRemove={onRemove} />
    </div>
  );
}
