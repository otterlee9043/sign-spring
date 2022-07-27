package com.sign.member.repository;

import com.sign.member.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Component
@Transactional
public class JpaMemberRepository implements MemberRepository{

    private final EntityManager em;

    @Autowired
    public JpaMemberRepository(EntityManager em) {
        this.em = em;
    }

    @Override
    public Member save(Member member) {
        em.persist(member);
        return member;
    }

    @Override
    public Optional<Member> findById(Long memberId) {
        Member member = em.find(Member.class, memberId);
        return Optional.ofNullable(member);
    }

    @Override
    public List<Member> findAll() {

        return em.createQuery("select m from Member m", Member.class).getResultList();
    }
}