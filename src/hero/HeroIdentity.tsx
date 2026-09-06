import { FormEvent, useState } from "react";

type HeroIdentityProps = Readonly<{
  active: boolean;
  name: string;
  onNameChange: (name: string) => void;
  onConfirm: (name: string) => void;
}>;

export function HeroIdentity({ active, name, onNameChange, onConfirm }: HeroIdentityProps) {
  const [invalid, setInvalid] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    onConfirm(name.trim());
  };

  return (
    <section className="hero-identity" aria-hidden={!active}>
      <form onSubmit={submit}>
        <label htmlFor="hero-name">What was your name?</label>
        <input
          id="hero-name"
          value={name}
          onChange={(event) => {
            onNameChange(event.target.value);
            if (invalid) setInvalid(false);
          }}
          autoFocus
          autoComplete="name"
          aria-invalid={invalid}
          aria-describedby={invalid ? "hero-name-error" : undefined}
          tabIndex={active ? 0 : -1}
        />
        <span className="hero-enter">Press Enter</span>
        <span id="hero-name-error" className="hero-name-error" role="alert">
          {invalid ? "Enter a name to continue." : ""}
        </span>
      </form>
    </section>
  );
}
