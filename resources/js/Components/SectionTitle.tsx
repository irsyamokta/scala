export default function SectionTitle({ title }: { title: string }) {
    return (
        <div className="flex items-center">
            <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary"></span>
                <p className="font-medium">{title}</p>
            </div>
        </div>
    );
}