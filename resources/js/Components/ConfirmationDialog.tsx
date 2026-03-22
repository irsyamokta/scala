import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Illustration from "../../assets/svg/img-delete.svg";
import { reverse } from "node:dns";

const MySwal = withReactContent(Swal);

interface ConfirmDialogOptions {
    title?: string;
    text: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    imageUrl?: string;
    reverseButtons?: boolean;
}

export async function ConfirmationDialog({
    title = "Hapus Pengguna?",
    text,
    confirmButtonText = "Ya, Hapus",
    cancelButtonText = "Tidak",
    imageUrl = Illustration,
    reverseButtons = false
}: ConfirmDialogOptions) {

    const result = await MySwal.fire({
        title,
        text,
        imageUrl,
        imageWidth: 260,
        imageAlt: "Dialog illustration",

        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,

        reverseButtons,

        width: 520,
        buttonsStyling: false,

        customClass: {
            popup: "swal-popup",
            title: "swal-title",
            htmlContainer: "swal-text",
            actions: "swal-actions",
            
            confirmButton: reverseButtons
                ? "swal-btn-confirm"
                : "swal-btn-delete",

            cancelButton: reverseButtons
                ? "swal-btn-secondary"
                : "swal-btn-confirm"
        }
    });

    return result.isConfirmed;
}
