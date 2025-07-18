import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { data_users } from '../../../example_data/users';

// ID             uuid.UUID      `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id" example:"550e8400-e29b-41d4-a716-446655440000"`
// 	Name           string         `gorm:"size:100" json:"name" example:"John Doe"`
// 	Email          string         `gorm:"unique;size:100" json:"email" example:"john.doe@example.com"`
// 	Password       string         `json:"-"`
// 	BirthDate      *time.Time     `json:"birth_date" example:"1990-01-15T00:00:00Z"`
// 	ProfilePicture string         `json:"profile_picture" example:"https://example.com/profile.jpg"`
// 	GithubURL      string         `json:"github_url" example:"https://github.com/johndoe"`
// 	LinkedinURL    string         `json:"linkedin_url" example:"https://linkedin.com/in/johndoe"`
// 	PitchVideo     string         `json:"pitch_video" example:"https://youtube.com/watch?v=example"`
// 	Headline       string         `json:"headline" example:"Full Stack Developer"`
// 	Bio            string         `json:"bio" example:"Passionate developer with 5+ years of experience"`
// 	Seniority      string         `json:"seniority" example:"Senior"`
// 	EnglishLevel   string         `json:"english_level" example:"Advanced"`
// 	EFSetScore     string         `json:"efset_score" example:"75"`
// 	Points         int            `json:"points" example:"1250"`
// 	Role           enums.UserRole `json:"role" example:"developer"`
// 	Country        enums.Country  `json:"country" example:"US"`
// 	Availability   string         `json:"availability" example:"Full-time"`
// 	Interests      string         `json:"interests" example:"JavaScript, Go, React"`
// 	Status         bool           `json:"status" example:"true"`
// 	CreatedAt      time.Time      `json:"created_at" example:"2024-01-15T10:30:00Z"`
// 	UpdatedAt      time.Time      `json:"updated_at" example:"2024-01-15T10:30:00Z"`

export interface User {
    ID: number;
    Name: string;
    Email: string;
    Password: string;
    BirthDate: string;
    ProfilePicture: string;
    GithubURL: string;
    LinkedinURL: string;
    PitchVideo: string;
    Headline: string;
    Bio: string;
    Seniority: string;
    EnglishLevel: string;
    EFSetScore: string;
    Points: number;
    Role: string;
    Country: string;
    Availability: string;
    Interests: string;
    Status: boolean;
    CreatedAt: string;
    UpdatedAt: string;
}

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    // Using data de ejemplo, carpeta de origen "example_data/users.json".
    _getUsers() {
        return Promise.resolve(data_users);
    }

    getUsers() {
        return this.http.get<User[]>('http://localhost:3000/users');
    }

    getUser(id: number) {
        return this.http.get<User>(`http://localhost:3000/users/${id}`);
    }

    createUser(user: User) {
        return this.http.post<User>('http://localhost:3000/users', user);
    }

    updateUser(user: User) {
        return this.http.put<User>(`http://localhost:3000/users/${user.ID}`, user);
    }

    deleteUser(id: number) {
        return this.http.delete<User>(`http://localhost:3000/users/${id}`);
    }
}