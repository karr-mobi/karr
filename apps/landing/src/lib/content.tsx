import {
    ArrowRight,
    Waypoints,
    Leaf,
    ShieldCheck,
    Server,
    ClipboardCheck,
    BadgePlus
} from "lucide-react"
import { SiGithub as Github } from "@icons-pack/react-simple-icons"

export const APP_NAME = "Karr"

export const github = {
    name: "GitHub",
    href: "https://github.com/finxol/karr",
    icon: Github
}

export const header = {
    title: APP_NAME,
    links: [
        { name: "Fonctionnalités", href: "#features" }
        //{ name: "Témoignages", href: "#testimonials" },
        //{ name: "Tarifs", href: "#pricing" },
        // { name: "Contact", href: "#contact" }
    ],
    cta: { name: "Contactez-nous", href: "#contact" }
}

export const footer = {
    note: `© ${new Date().getFullYear()} ${APP_NAME}. Tous droits réservés.`,
    links: [
        // { name: "Confidentialité", href: "#" },
        // { name: "Conditions", href: "#" },
        { name: "Contact", href: "#contact" }
    ],
    socialLinks: [
        github
        // {
        //     name: "Twitter",
        //     href: "#",
        //     icon: <Twitter className="h-5 w-5" />
        // },
        // {
        //     name: "LinkedIn",
        //     href: "#",
        //     icon: <Linkedin className="h-5 w-5" />
        // },
        // {
        //     name: "Facebook",
        //     href: "#",
        //     icon: <Facebook className="h-5 w-5" />
        // }
    ]
}

export const hero = {
    badge: "Bientôt en beta",
    title: "Le Covoiturage d'Entreprise Simplifié",
    description: `Connectez vos employés, réduisez les coûts de trajet et
        diminuez l'empreinte carbone de votre entreprise
        grâce à notre plateforme de covoiturage fédérée et open-source.`,
    ctas: [
        {
            name: "Contactez-nous",
            href: "#contact"
        },
        {
            name: "Voir la Démo",
            href: "https://demo.karr.mobi"
        }
    ],
    subtext: "Solution open-source, hébergée par vos soins."
}

export const features = {
    title: "Fonctionnalités de Covoiturage Puissantes pour les Entreprises Modernes",
    description: `Tout ce dont vous avez besoin pour implémenter, gérer et développer
        votre système de covoiturage d'entreprise.`,
    features: [
        {
            title: "Le Covoiturage Au-Delà de Votre Entreprise",
            description: `Connectez-vous avec les entreprises voisines pour étendre
                votre réseau de covoiturage et maximiser les opportunités de correspondance,
                tout en maintenant la confidentialité des données.`,
            icon: Waypoints
        },
        {
            title: "Votre Impact Écologique, Clairement Mesuré",
            description: `Suivez et générez des rapports sur les émissions de CO2 économisées
                grâce au programme de covoiturage de votre entreprise.`,
            icon: Leaf
        },
        {
            title: "Confiance et Sécurité pour Vos Équipes",
            description: `Des systèmes de vérification complets et des contrôles de confidentialité
                assurent la sécurité et la protection des données des employés.`,
            icon: ShieldCheck
        },
        {
            title: "Vos Données, Votre Infrastructure",
            description: `Hébergez Karr sur votre propre infrastructure pour une souveraineté
                totale des données. Adoptez une approche zero-trust et assurez la confidentialité
                maximale des informations de vos employés.`,
            icon: Server
        },
        {
            title: "Atteignez vos Objectifs RSE & Mobilité",
            description: `Utilisez les données et rapports générés par Karr pour alimenter votre
                Plan de Mobilité Employeur (PDME) et valoriser vos actions de
                Responsabilité Sociétale des Entreprises (RSE).`,
            icon: ClipboardCheck
        },
        {
            title: "Le Covoiturage Sans Frais pour Vos Équipes",
            description: `Supprimez les frais de service pour vos salariés.
                En rendant le covoiturage plus économique pour eux, vous levez un frein majeur
                et encouragez une adoption plus large, réduisant ainsi l'empreinte carbone globale de l'entreprise.`,
            icon: BadgePlus
        }
    ]
}

export const testimonials = [
    {
        quote: "Karr a transformé notre culture de déplacement domicile-travail. Nous avons réduit nos besoins en stationnement de 30% et les employés économisent des milliers sur les coûts de carburant.",
        author: "Sarah Johnson",
        role: "Directrice du Développement Durable, TechCorp",
        avatar: "/placeholder.svg?height=64&width=64"
    },
    {
        quote: "La fonctionnalité de fédération nous a permis de nous connecter avec trois entreprises voisines, augmentant considérablement les correspondances de covoiturage réussies.",
        author: "Michael Chen",
        role: "Responsable des Installations, InnovateCo",
        avatar: "/placeholder.svg?height=64&width=64"
    },
    {
        quote: "Nos employés adorent la flexibilité et l'aspect social. De plus, nous avons réduit nos émissions de carbone de 25% en seulement six mois.",
        author: "Emily Rodriguez",
        role: "Directrice des Ressources Humaines, GrowthInc",
        avatar: "/placeholder.svg?height=64&width=64"
    }
]

export const plans = [
    {
        name: "Découverte",
        price: "$299",
        description:
            "Parfait pour les petites entreprises jusqu'à 50 employés.",
        features: [
            "Jusqu'à 50 employés",
            "Correspondance d'itinéraires basique",
            "Tableau de bord de suivi CO2",
            "Support par email"
        ]
    },
    {
        name: "Affaires",
        price: "$599",
        description:
            "Idéal pour les entreprises en croissance nécessitant plus de fonctionnalités et de capacité.",
        features: [
            "Jusqu'à 200 employés",
            "Optimisation avancée des itinéraires",
            "Fédération inter-entreprises",
            "Support prioritaire",
            "Programme de récompenses pour navetteurs"
        ],
        popular: true
    },
    {
        name: "Entreprise",
        price: "Sur mesure",
        description:
            "Pour les grandes organisations ayant des besoins spécifiques et plusieurs sites.",
        features: [
            "Employés illimités",
            "Support multi-sites",
            "Gestionnaire de compte dédié",
            "Intégrations personnalisées",
            "Support téléphonique 24/7",
            "Analyses avancées"
        ]
    }
]

export const cta = {
    title: "Prêt à Transformer les Trajets de Votre Entreprise ?",
    description: `Rejoignez les entreprises avant-gardistes qui utilisent déjà Karr pour réduire les coûts,
        diminuer les émissions et améliorer la satisfaction des employés.`,
    ctas: [
        {
            name: (
                <>
                    Commencer
                    <ArrowRight className="ml-2 h-4 w-4" />
                </>
            ),
            href: "#contact",
            variant: "default"
        },
        {
            name: "Voir la Démo",
            href: "https://demo.karr.mobi",
            variant: "outline"
        }
    ],
    subtext: "Solution open-source, hébergée par vos soins."
}
