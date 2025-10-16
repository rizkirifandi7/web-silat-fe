import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
	className,
	type,
	value,
	defaultValue,
	...props
}: React.ComponentProps<"input">) {
	// Avoid switching between uncontrolled and controlled inputs by
	// normalizing `value` to an empty string when it's undefined or null
	// for non-file inputs. File inputs must not have a `value` prop.
	const isFile = type === "file";
	const controlledProps: Partial<React.InputHTMLAttributes<HTMLInputElement>> =
		{};

	if (!isFile) {
		// If value is undefined/null, prefer defaultValue or empty string to keep
		// the input controlled when consumers pass a value later.
		if (value === undefined || value === null) {
			// Only set value if a defaultValue is not provided. This keeps
			// backward compatibility with uncontrolled usages that rely on defaultValue.
			controlledProps.value = defaultValue !== undefined ? defaultValue : "";
		} else {
			// value can be string | number | readonly string[] | undefined
			controlledProps.value = value as
				| string
				| number
				| readonly string[]
				| undefined;
		}
	}

	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
				"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
				className
			)}
			{...controlledProps}
			defaultValue={defaultValue}
			{...props}
		/>
	);
}

export { Input };

